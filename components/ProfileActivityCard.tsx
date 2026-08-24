import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme/tokens';

export interface ProfileActivityMetrics {
  completedDevotionals: number;
  savedVerses: number;
  highlights: number;
  notes: number;
}

interface ProfileActivityCardProps {
  metrics: ProfileActivityMetrics;
}

const activityLabels: Array<[keyof ProfileActivityMetrics, string]> = [
  ['completedDevotionals', 'Devocionais concluídos'],
  ['savedVerses', 'Versículos salvos'],
  ['highlights', 'Grifos'],
  ['notes', 'Anotações'],
];

export function ProfileActivityCard({ metrics }: ProfileActivityCardProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Sua atividade</Text>
      <View style={styles.card}>
        {activityLabels.map(([key, label], index) => (
          <View key={key} style={[styles.row, index > 0 && styles.divider]}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{metrics[key]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.xl,
  },
  title: {
    ...typography.heading,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  label: {
    ...typography.body,
    color: colors.ink,
    flex: 1,
  },
  value: {
    ...typography.body,
    color: colors.muted,
    fontWeight: '600',
    marginLeft: spacing.lg,
  },
});
