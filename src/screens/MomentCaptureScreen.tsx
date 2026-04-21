import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { Colors, Radius, Spacing, Typography } from '@/src/design/tokens';
import { GlassCard, GlowButton, PremiumInput } from '@/src/components/premium/PremiumPrimitives';

const steps = ['Basics', 'Guests', 'Experience'];

export function MomentCaptureScreen() {
  const [step, setStep] = useState(0);
  const progress = useMemo(() => `${step + 1}/${steps.length}`, [step]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.duration(420)}>
          <Text style={styles.title}>Create Event</Text>
          <Text style={styles.subtitle}>Elegant step-by-step flow with focus on one action.</Text>
        </Animated.View>

        <GlassCard>
          <Text style={styles.stepLabel}>Step {progress} · {steps[step]}</Text>
          <Animated.View layout={Layout.springify()} style={styles.form}>
            {step === 0 && (
              <>
                <PremiumInput placeholder="Event name" />
                <PremiumInput placeholder="Venue" />
              </>
            )}
            {step === 1 && (
              <>
                <PremiumInput placeholder="Key guests" />
                <PremiumInput placeholder="VIP contacts" />
              </>
            )}
            {step === 2 && (
              <>
                <PremiumInput placeholder="Mood / visual direction" />
                <PremiumInput placeholder="AI assistant notes" multiline numberOfLines={4} />
              </>
            )}
          </Animated.View>
          <View style={styles.navRow}>
            <GlowButton label={step === 0 ? 'Cancel' : 'Back'} icon="chevron-left" onPress={() => setStep((v) => Math.max(0, v - 1))} />
            <GlowButton label={step === steps.length - 1 ? 'Publish' : 'Next'} icon="chevron-right" onPress={() => setStep((v) => Math.min(steps.length - 1, v + 1))} />
          </View>
        </GlassCard>

        <View style={styles.indicatorRow}>
          {steps.map((item, i) => (
            <View key={item} style={[styles.dot, i <= step && styles.dotActive]} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 72, gap: Spacing.lg, paddingBottom: 140 },
  title: { ...Typography.title, fontSize: 34 },
  subtitle: { ...Typography.body, color: Colors.textMuted, marginTop: 8 },
  stepLabel: { ...Typography.label, marginBottom: Spacing.md },
  form: { gap: Spacing.md },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.lg },
  indicatorRow: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  dot: { width: 28, height: 6, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.15)' },
  dotActive: { backgroundColor: Colors.secondary },
});
