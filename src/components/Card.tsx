import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Radius, Shadow } from '../design/tokens';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  tinted?: boolean;
  gradient?: boolean;
}

export function Card({ children, style, tinted = false, gradient = false }: CardProps) {
  if (gradient) {
    return (
      <LinearGradient
        colors={tinted ? Gradients.primarySubtle : Gradients.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, Shadow.soft, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, tinted && styles.tinted, Shadow.soft, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.xxl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tinted: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.borderGlow,
  },
});
