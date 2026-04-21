import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius } from '../design/tokens';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  tinted?: boolean;
}

export function Card({ children, style, tinted = false }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        tinted && styles.tinted,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tinted: {
    backgroundColor: Colors.tintedBackground,
  },
});
