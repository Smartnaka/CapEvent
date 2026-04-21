import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View, ViewProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '@/src/design/tokens';

export function GlassCard({ style, ...props }: ViewProps) {
  return (
    <View style={[styles.card, style]} {...props} />
  );
}

export function GlowButton({ label, icon, onPress }: { label: string; icon?: keyof typeof Feather.glyphMap; onPress?: () => void }) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={anim}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={onPress}
        style={styles.button}
      >
        {icon ? <Feather name={icon} size={16} color="#0A0A0A" /> : null}
        <Text style={styles.buttonText}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function PremiumInput(props: TextInputProps) {
  return (
    <View style={styles.inputWrap}>
      <TextInput
        placeholderTextColor={Colors.textFaint}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...Typography.label,
    color: '#0A0A0A',
    fontSize: 14,
    fontWeight: '700',
  },
  inputWrap: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  input: {
    ...Typography.body,
    color: Colors.text,
  },
});
