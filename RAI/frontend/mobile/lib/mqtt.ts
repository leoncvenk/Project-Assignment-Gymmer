import Paho from 'paho-mqtt';

// Bere vrednosti iz .env (vsak član ekipe ima svojega)
const MQTT_BROKER_URL = process.env.EXPO_PUBLIC_MQTT_BROKER_URL;
const MQTT_PORT = parseInt(process.env.EXPO_PUBLIC_MQTT_PORT || '8083');

let client: Paho.Client | null = null;

const getHeartbeatTopic = (userId: string, deviceId: string) =>
  `gymmer/live/${userId}/${deviceId}/heartbeat`;

const getLocationTopic = (userId: string, deviceId: string) =>
  `gymmer/live/${userId}/${deviceId}/location`;

const getStatusTopic = (userId: string, deviceId: string) =>
  `gymmer/live/${userId}/${deviceId}/status`;

export const connectMqtt = (
  userId: string,
  deviceId: string,
  onConnectCallback: () => void,
  onMessageCallback: (message: Paho.Message) => void
) => {
  if (!MQTT_BROKER_URL) {
    console.error('NAPAKA: EXPO_PUBLIC_MQTT_BROKER_URL ni nastavljen v .env!');
    return;
  }

  const clientId = `gymmer_mobile_${deviceId}_${Math.random().toString(16).slice(2, 10)}`;

  // Inicializacija - zdaj dinamično iz .env
  client = new Paho.Client(MQTT_BROKER_URL, MQTT_PORT, clientId);

  const lastWillMessage = new Paho.Message(
    JSON.stringify({
      userId,
      deviceId,
      status: 'offline',
      timestamp: new Date().toISOString(),
    })
  );
  lastWillMessage.destinationName = getStatusTopic(userId, deviceId);
  lastWillMessage.retained = true;
  lastWillMessage.qos = 1;

  client.onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.error('MQTT Connection Lost:', responseObject.errorMessage);
    }
  };

  client.onMessageArrived = (message) => {
    onMessageCallback(message);
  };

  client.connect({
    onSuccess: () => {
      console.log(`Povezan na lokalni broker: ${MQTT_BROKER_URL}:${MQTT_PORT}`);
      onConnectCallback();
    },
    onFailure: (e) => {
      console.error('MQTT Connection failed:', e.errorMessage);
    },
    willMessage: lastWillMessage,
    useSSL: false, // Lokalni brokerji preko WS običajno ne uporabljajo SSL
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
    message.qos = 1; // Poskusi dodati QoS 1 za zanesljivost
    client.send(message);

    // TOLE DODAJ:
    console.log('Heartbeat poslan na:', topic);
    console.log('Vsebina:', payload);
  } else {
    console.warn('Cannot send heartbeat, MQTT client not connected');
  }
};
export const disconnectMqtt = () => {
  if (client && client.isConnected()) {
    client.disconnect();
    client = null;
  }
};
