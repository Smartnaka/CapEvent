import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync().then(() => {
  SplashScreen.setOptions({ duration: 800, fade: true });
});

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loaded) {
      return;
    }

    async function initApp() {
      // Check for OTA updates before showing the app so users always get the
      // latest bundle without needing a full store release.
      if (Updates.isEnabled) {
        try {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
            // reloadAsync() restarts the JS bundle — nothing below executes.
            return;
          }
        } catch (e) {
          // Network errors or misconfiguration should not block the app.
          console.warn('EAS update check failed:', e);
        }
      }

      await SplashScreen.hideAsync();

      const val = await AsyncStorage.getItem('capevent_onboarded');
      if (val) {
        router.replace('/(tabs)');
      }
      setReady(true);
    }

    initApp();
  }, [loaded, router]);

  if (!loaded || !ready) {
    return null;
  }

  const appTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#F8F6F4',
      card: '#FFFFFF',
      text: '#1F2852',
      border: '#ECE6F5',
      primary: '#9D7BEA',
    },
  };

  return (
    <ThemeProvider value={appTheme}>
      <Stack initialRouteName="onboarding">
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
