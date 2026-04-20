import { useRouter } from 'expo-router';
import { HomeDashboardScreen } from '@/src/screens/HomeDashboardScreen';

export default function HomeTab() {
  const router = useRouter();

  return (
    <HomeDashboardScreen
      onNavigateCapture={() => router.push('/(tabs)/capture')}
      onNavigateSummary={() => router.push('/(tabs)/summary')}
    />
  );
}
