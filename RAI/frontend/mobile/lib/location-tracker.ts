import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendLocationUpdate } from './mqtt';

export function useLocationTracker(userId: string | null | undefined, deviceId?: string) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    speed?: number | null;
  } | null>(null);
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>([]);
  const [subscription, setSubscription] = useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    async function loadSavedRoute() {
      if (!userId) return;

      const ROUTE_KEY = `@gymmer_route_coords_${userId}`;
      const DATE_KEY = `@gymmer_route_date_${userId}`;

      try {
        const savedRoute = await AsyncStorage.getItem(ROUTE_KEY);
        const savedDate = await AsyncStorage.getItem(DATE_KEY);
        const today = new Date().toDateString();

        if (savedDate === today && savedRoute) {
          setRoute(JSON.parse(savedRoute));
        } else {
          await AsyncStorage.setItem(DATE_KEY, today);
          await AsyncStorage.setItem(ROUTE_KEY, JSON.stringify([]));
          setRoute([]);
        }
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (error) {
        console.error('Error loading route:', error);
      }
    }

    loadSavedRoute();
  }, [userId]);

  async function startTracking() {
    if (!userId) {
      console.log('Cannot start tracking: No user ID');
      return;
    }

    const ROUTE_KEY = `@gymmer_route_coords_${userId}`;
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Location permission denied.');
      return;
    }

    setIsTracking(true);

    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000,
        distanceInterval: 2,
      },
      (newLocation) => {
        const coords = {
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
        };

        setCurrentLocation(coords);

        setRoute((prevRoute) => {
          const updatedRoute = [...prevRoute, coords];

          AsyncStorage.setItem(ROUTE_KEY, JSON.stringify(updatedRoute)).catch((err) =>
            console.error('Error saving route:', err)
          );

          return updatedRoute;
        });
      }
    );

    setSubscription(sub);
  }

  function stopTracking() {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
    setIsTracking(false);
  }

  return { isTracking, currentLocation, route, startTracking, stopTracking };
}
