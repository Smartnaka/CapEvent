import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow, Spacing } from '@/src/design/tokens';

const icons: Record<string, keyof typeof Feather.glyphMap> = {
  index: 'home',
  capture: 'plus-circle',
  summary: 'layers',
  profile: 'user',
};

// Minimum bottom inset on Android when the system reports 0 (e.g. full-screen
// gesture navigation) so the bar never hugs the very bottom edge.
const ANDROID_MIN_INSET = 8;
// Extra gap between the safe-area inset boundary and the floating tab bar.
const BOTTOM_GAP = 12;

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const tabWidth = 100 / state.routes.length;
  // Respect the device's bottom safe-area inset (home indicator on iOS,
  // gesture / 3-button nav bar on Android) and add a comfortable gap.
  const bottomOffset = Math.max(insets.bottom, Platform.OS === 'android' ? ANDROID_MIN_INSET : 0) + BOTTOM_GAP;

  return (
    <View style={[styles.tabWrapper, { bottom: bottomOffset }]}>
      <BlurView intensity={40} tint="dark" style={styles.tabBar}>
        <View style={[styles.indicator, { width: `${tabWidth}%`, left: `${state.index * tabWidth}%` }]} />
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              onPress={onPress}
              style={styles.tabItem}
            >
              <Feather name={icons[route.name]} size={20} color={isFocused ? Colors.primary : Colors.textFaint} />
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {descriptors[route.key].options.title}
              </Text>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="capture" options={{ title: 'Create' }} />
      <Tabs.Screen name="summary" options={{ title: 'Details' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    ...Shadow.card,
    // Ensure Android elevation is set for proper shadow rendering
    elevation: 16,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.stroke,
    backgroundColor: 'rgba(8,8,15,0.85)',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(122,125,255,0.18)',
    borderRadius: Radius.xl,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Spacing.sm + 2,
    zIndex: 1,
  },
  tabLabel: { fontSize: 11, color: Colors.textFaint, fontWeight: '600' },
  tabLabelActive: { color: Colors.primary },
});
