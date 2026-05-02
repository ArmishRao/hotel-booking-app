import SplashScreen from './SplashScreen';  // ← same folder
import { useRouter } from 'expo-router';

export default function Onboarding() {
  const router = useRouter();

  return (
    <SplashScreen
      onFinish={() => router.replace('/onboarding/OnboardingScreen1')}
    />
  );
}