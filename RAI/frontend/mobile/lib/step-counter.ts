import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STEPS_KEY = '@gymmer_steps';
const DATE_KEY = '@gymmer_steps_date';

export function useStepCounter() {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    async function loadSteps() {
      try {
        const savedSteps = await AsyncStorage.getItem(STEPS_KEY);
        const savedDate = await AsyncStorage.getItem(DATE_KEY);
        const today = new Date().toDateString();

        if (savedDate === today && savedSteps) {
          setSteps(parseInt(savedSteps, 10));
        } else {
          await AsyncStorage.setItem(DATE_KEY, today);
          await AsyncStorage.setItem(STEPS_KEY, '0');
          setSteps(0);
        }
      } catch (error) {
        console.error('Napaka pri nalaganju korakov:', error);
      }
    }

    loadSteps();
  }, []);

  useEffect(() => {
    let isStepping = false;

    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const threshold = 1.2;

      if (magnitude > threshold && !isStepping) {
        isStepping = true;

        setSteps((prev) => {
          const newSteps = prev + 1;
          AsyncStorage.setItem(STEPS_KEY, newSteps.toString()).catch((err) =>
            console.error('Napaka pri shranjevanju:', err)
          );
          return newSteps;
        });
      } else if (magnitude < 1.0) {
        isStepping = false;
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return steps;
}
