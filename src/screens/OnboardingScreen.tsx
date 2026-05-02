import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '@/src/design/tokens';
import { GlowButton, GlassCard } from '@/src/components/premium/PremiumPrimitives';

export function OnboardingScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const y = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    y.value = withDelay(100, withSpring(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }));

  const handleEnter = async () => {
    await AsyncStorage.setItem('capevent_onboarded', 'true');
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.bg}>
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.content, anim]}>
          <Text style={styles.eyebrow}>CapEvent AI</Text>
          <Text style={styles.title}>Capture events with calm, intelligent flow.</Text>
          <Text style={styles.subtitle}>Designed for founders, operators, and teams who move fast.</Text>

          <GlassCard style={styles.visualCard}>
            <View>
              <Text style={styles.cardLabel}>Today</Text>
              <Text style={styles.cardTitle}>AI highlighted 4 moments worth follow-up.</Text>
            </View>
          </GlassCard>

          <GlowButton label="Enter Experience" icon="arrow-right" onPress={handleEnter} />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.xl,
    paddingBottom: 56,
  },
  eyebrow: { ...Typography.label, fontSize: 14, letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { ...Typography.hero, marginTop: 10 },
  subtitle: { ...Typography.body, color: Colors.textMuted, marginTop: Spacing.md },
  visualCard: { marginTop: Spacing.xl },
  cardLabel: { ...Typography.caption, marginBottom: 8 },
  cardTitle: { ...Typography.heading },
});
