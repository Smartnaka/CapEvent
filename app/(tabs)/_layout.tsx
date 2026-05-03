import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '@/src/design/tokens';

const VISIBLE_TAB_ROUTES = ['index', 'capture', 'profile'] as const;

const icons: Record<string, keyof typeof Feather.glyphMap> = {
  index: 'home',
  capture: 'plus',
  profile: 'user',
};

const labels: Record<string, string> = {
  index: 'Home',
  capture: '',
  profile: 'Profile',
};

function CustomTabBar({ state, navigation }: any) {
  const isCaptureFocused = state.routes[state.index]?.name === 'capture';
  if (isCaptureFocused) return null;

  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) + 8;

  return (
    <View style={[styles.wrapper, { bottom: bottomOffset }]}>
      <View style={styles.bar}>
        {state.routes.filter((route: any) => VISIBLE_TAB_ROUTES.includes(route.name)).map((route: any) => {
          const routeIndex = state.routes.findIndex((r: any) => r.key === route.key);
          const isFocused = state.index === routeIndex;
          const isCapture = route.name === 'capture';
          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={[styles.item, isCapture && styles.captureSlot]}
            >
              <View style={[styles.iconWrap, isFocused && !isCapture && styles.iconWrapActive, isCapture && styles.captureButton]}>
                <Feather
                  name={icons[route.name]}
                  size={isCapture ? 24 : 18}
                  color={isFocused || isCapture ? '#FFFFFF' : Colors.textFaint}
                />
              </View>
              {labels[route.name] ? (
                <Text style={[styles.label, isFocused && styles.labelActive]}>{labels[route.name]}</Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="capture" />
      <Tabs.Screen name="summary" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 18,
    right: 18,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    ...Shadow.medium,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  captureSlot: {
    marginTop: -24,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
  },
  captureButton: {
    width: 52,
    height: 52,
    backgroundColor: Colors.accent,
    borderWidth: 4,
    borderColor: Colors.surface,
    ...Shadow.glow,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textFaint,
  },
  labelActive: {
    color: Colors.accent,
  },
});
