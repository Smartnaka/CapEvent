import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Keep the splash screen visible while fonts are loading, then fade it out.
SplashScreen.preventAutoHideAsync().then(() => {
  SplashScreen.setOptions({ duration: 500, fade: true });
});

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const appTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#0A0A0A',
      card: '#111111',
      text: '#FFFFFF',
      border: '#1F2937',
      primary: '#D4AF37',
    },
  };

  return (
    <ThemeProvider value={appTheme}>
      <Stack initialRouteName="onboarding">
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
