// app/layout.tsx
import { Stack } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';
import { UserProvider } from '../context/usercontext'; // adjust path as needed


export default function Layout() {
  useEffect(() => {
    // Lock orientation globally to portrait
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </UserProvider>
  );
  
}
