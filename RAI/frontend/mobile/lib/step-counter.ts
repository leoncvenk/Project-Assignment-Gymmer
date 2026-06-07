// lib/step-counter.ts
import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';

export function useStepCounter() {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    let isStepping = false;

    // Set the frequency of updates (100ms = 10 updates per second)
    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      // Calculate the total magnitude of the 3D acceleration vector
      const magnitude = Math.sqrt(x * x + y * y + z * z);

      // Standard gravity is 1G. A step impact usually exceeds 1.2G.
      const threshold = 1.2;

      // Register a step if the force crosses the threshold and we aren't already mid-step
      if (magnitude > threshold && !isStepping) {
        isStepping = true;
        setSteps((prev) => prev + 1);
      } else if (magnitude < 1.0) {
        // Reset the lock when the acceleration drops below gravity
        isStepping = false;
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return steps;
}