import { useRouter } from 'expo-router';
import { HomeDashboardScreen } from '@/src/screens/HomeDashboardScreen';

export default function HomeTab() {
  const router = useRouter();
  return <HomeDashboardScreen onNavigateDetails={() => router.push('/(tabs)/details')} />;
}
