import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Shadow, Spacing, Typography } from '../design/tokens';
import { TagChip } from './TagChip';
import { Moment } from '../types/moment';

interface MomentItemProps {
  moment: Moment;
  index?: number;
}

const TYPE_META: Record<string, { icon: string; color: string; label: string }> = {
  voice: { icon: '🎙', color: Colors.destructive, label: 'Voice' },
  photo: { icon: '📸', color: Colors.accentBlue, label: 'Photo' },
  text: { icon: '✦', color: Colors.accent, label: 'Note' },
};

export function MomentItem({ moment }: MomentItemProps) {
  const formattedTime = new Date(moment.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const meta = TYPE_META[moment.type] ?? TYPE_META.text;

  return (
    <View style={[styles.card, Shadow.soft]}>
      <View style={styles.header}>
        <View style={[styles.typeBadge, { borderColor: meta.color + '40', backgroundColor: meta.color + '18' }]}>
          <Text style={styles.typeIcon}>{meta.icon}</Text>
          <Text style={[styles.typeLabel, { color: meta.color }]}>{meta.label}</Text>
        </View>
        <Text style={styles.time}>{formattedTime}</Text>
      </View>
      <Text style={styles.content} numberOfLines={3}>
        {moment.content}
      </Text>
      {moment.tags.length > 0 && (
        <View style={styles.tags}>
          {moment.tags.map((tag) => (
            <TagChip key={tag} label={tag} selected={true} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.xxl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  typeIcon: {
    fontSize: 13,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  time: {
    ...Typography.small,
    color: Colors.mutedText,
  },
  content: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});
