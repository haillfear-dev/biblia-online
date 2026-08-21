import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
export function InfoCard({ title, text, children }: PropsWithChildren<{ title: string; text?: string }>) { return <View style={styles.card}><Text style={styles.title}>{title}</Text>{text && <Text style={styles.text}>{text}</Text>}{children}</View>; }
const styles = StyleSheet.create({ card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, ...shadows.card }, title: { ...typography.heading, color: colors.ink }, text: { ...typography.body, color: colors.muted, marginTop: spacing.sm } });
