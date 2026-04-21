import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { Colors, Radius, Spacing, Typography } from '@/src/design/tokens';
import { GlassCard, GlowButton, PremiumInput } from '@/src/components/premium/PremiumPrimitives';
import { saveEvent, saveMoment } from '@/src/storage/localDb';
import { EventDraft } from '@/src/types/event';

const steps = ['Basics', 'Guests', 'Experience'];

const initialDraft: EventDraft = {
  name: '',
  venue: '',
  keyGuests: '',
  vipContacts: '',
  mood: '',
  notes: '',
};

export function MomentCaptureScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<EventDraft>(initialDraft);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = useMemo(() => `${step + 1}/${steps.length}`, [step]);

  const updateDraft = (field: keyof EventDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    if (error) {
      setError(null);
    }
  };

  const onBack = () => {
    if (step === 0) {
      setDraft(initialDraft);
      return;
    }
    setStep((current) => Math.max(0, current - 1));
  };

  const onNextOrPublish = async () => {
    if (step < steps.length - 1) {
      setStep((current) => Math.min(steps.length - 1, current + 1));
      return;
    }

    if (!draft.name.trim() || !draft.venue.trim()) {
      setError('Event name and venue are required to publish.');
      return;
    }

    setIsSaving(true);

    try {
      const savedEvent = await saveEvent(draft);
      await saveMoment({
        type: 'text',
        content: `${savedEvent.name} @ ${savedEvent.venue} — ${savedEvent.notes || 'New event created.'}`,
        tags: [savedEvent.name, 'event'].filter(Boolean),
        createdAt: savedEvent.createdAt,
      });

      setDraft(initialDraft);
      setStep(0);
      await router.navigate('/(tabs)/summary');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.duration(420)}>
          <Text style={styles.title}>Create Event</Text>
          <Text style={styles.subtitle}>Store each event and keep your dashboard in sync.</Text>
        </Animated.View>

        <GlassCard>
          <Text style={styles.stepLabel}>Step {progress} · {steps[step]}</Text>
          <Animated.View layout={Layout.springify()} style={styles.form}>
            {step === 0 && (
              <>
                <PremiumInput placeholder="Event name" value={draft.name} onChangeText={(value) => updateDraft('name', value)} />
                <PremiumInput placeholder="Venue" value={draft.venue} onChangeText={(value) => updateDraft('venue', value)} />
              </>
            )}
            {step === 1 && (
              <>
                <PremiumInput placeholder="Key guests" value={draft.keyGuests} onChangeText={(value) => updateDraft('keyGuests', value)} />
                <PremiumInput placeholder="VIP contacts" value={draft.vipContacts} onChangeText={(value) => updateDraft('vipContacts', value)} />
              </>
            )}
            {step === 2 && (
              <>
                <PremiumInput placeholder="Mood / visual direction" value={draft.mood} onChangeText={(value) => updateDraft('mood', value)} />
                <PremiumInput
                  placeholder="AI assistant notes"
                  multiline
                  numberOfLines={4}
                  value={draft.notes}
                  onChangeText={(value) => updateDraft('notes', value)}
                />
              </>
            )}
          </Animated.View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.navRow}>
            <GlowButton label={step === 0 ? 'Reset' : 'Back'} icon="chevron-left" onPress={onBack} />
            <GlowButton
              label={isSaving ? 'Saving…' : step === steps.length - 1 ? 'Publish' : 'Next'}
              icon="chevron-right"
              onPress={() => {
                if (!isSaving) {
                  void onNextOrPublish();
                }
              }}
            />
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
  errorText: { ...Typography.caption, color: '#FF7E8A', marginTop: Spacing.md },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.lg },
  indicatorRow: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  dot: { width: 28, height: 6, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.15)' },
  dotActive: { backgroundColor: Colors.secondary },
});
