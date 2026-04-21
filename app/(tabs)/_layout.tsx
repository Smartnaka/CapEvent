import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing } from '@/src/design/tokens';

const icons: Record<string, keyof typeof Feather.glyphMap> = {
  index: 'home',
  capture: 'edit-2',
  summary: 'file-text',
  profile: 'user',
};

const ANDROID_MIN_INSET = 8;
const BOTTOM_GAP = 12;

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const bottomOffset =
    Math.max(insets.bottom, Platform.OS === 'android' ? ANDROID_MIN_INSET : 0) + BOTTOM_GAP;

  return (
    <View style={[styles.tabWrapper, { bottom: bottomOffset }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
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
              <Feather
                name={icons[route.name]}
                size={20}
                color={isFocused ? Colors.accent : Colors.textFaint}
              />
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {descriptors[route.key].options.title}
              </Text>
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
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="capture" options={{ title: 'Capture' }} />
      <Tabs.Screen name="summary" options={{ title: 'Summary' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Spacing.sm + 2,
  },
  tabLabel: {
    fontSize: 11,
    color: Colors.textFaint,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: Colors.accent,
  },
});
