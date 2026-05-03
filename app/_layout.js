import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function Layout() {
  return (

  <AuthProvider>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="hotel-detail" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
    </Stack>
    </AuthProvider>
  );
}