import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme/tokens';

type ProfileActivityCardProps = {
  completedDevotionals: number;
  savedVerses: number;
  highlights: number;
  notes: number;
};

const Metric = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.metricRow}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

export function ProfileActivityCard({
  completedDevotionals,
  savedVerses,
  highlights,
  notes,
}: ProfileActivityCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Sua atividade</Text>
      <View style={styles.metrics}>
        <Metric label="Devocionais concluídos" value={completedDevotionals} />
        <Metric label="Versículos salvos" value={savedVerses} />
        <Metric label="Grifos" value={highlights} />
        <Metric label="Anotações" value={notes} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.heading,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  metrics: {
    gap: spacing.sm,
  },
  metricRow: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricLabel: {
    ...typography.body,
    color: colors.muted,
    flex: 1,
    paddingRight: spacing.md,
  },
  metricValue: {
    ...typography.heading,
    color: colors.ink,
  },
});
