import Paho from 'paho-mqtt';

// Pozabimo na .env in tunele, gremo direktno na javni oblak! Uporabljeno ker drugače mi ni delalo na telefonu.
const MQTT_BROKER_URL = 'broker.emqx.io';
const MQTT_PORT = 8084; // Varna vrata (WSS) za EMQX strežnik

let client: Paho.Client | null = null;

export const connectMqtt = (
  userId: string,
  deviceId: string,
  onConnectCallback: () => void,
  onMessageCallback: (message: Paho.Message) => void
) => {
  const clientId = `gymmer_mobile_${deviceId}_${Math.random().toString(16).substr(2, 8)}`;

  client = new Paho.Client(MQTT_BROKER_URL, MQTT_PORT, clientId);

  const lastWillMessage = new Paho.Message(
    JSON.stringify({
      userId,
      deviceId,
      status: 'offline',
      timestamp: new Date().toISOString(),
    })
  );
  lastWillMessage.destinationName = `gymmer/live/${userId}/${deviceId}/heartbeat`;
  lastWillMessage.retained = true;
  lastWillMessage.qos = 1;

  client.onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log('MQTT Connection Lost:', responseObject.errorMessage);
    }
  };

  client.onMessageArrived = (message) => {
    onMessageCallback(message);
  };

  client.connect({
    onSuccess: () => {
      console.log('Connected to MQTT via Cloud (EMQX)');
      onConnectCallback();
    },
    onFailure: (e) => {
      console.error('MQTT Connection failed:', e.errorMessage);
    },
    willMessage: lastWillMessage,
    useSSL: true, // Obvezno vklopljeno za port 8084!
  });
};

export const sendHeartbeat = (userId: string, deviceId: string) => {
  if (client && client.isConnected()) {
    const topic = `gymmer/live/${userId}/${deviceId}/heartbeat`;
    const payload = JSON.stringify({
      userId,
      deviceId,
      status: 'online',
      timestamp: new Date().toISOString(),
    });

    const message = new Paho.Message(payload);
    message.destinationName = topic;
    client.send(message);
    console.log('Heartbeat sent to:', topic);
  } else {
    console.warn('Cannot send heartbeat, MQTT client not connected');
  }
};

export const disconnectMqtt = () => {
  if (client && client.isConnected()) {
    client.disconnect();
  }
};
