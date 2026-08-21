import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export default function Authentication() {
  const { configured, loading, signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const enter = () => router.replace('/(tabs)');
  const login = async () => {
    setError('');
    try { if (await signInWithGoogle()) enter(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Não foi possível entrar.'); }
  };
  return <Screen scroll={false} style={styles.screen}><View style={styles.content}><View style={styles.icon}><Feather name="book-open" size={34} color={colors.gold} /></View><Text style={styles.title}>Sua Bíblia, sempre perto</Text><Text style={styles.body}>Entre para preparar sua conta ou continue lendo sem cadastro.</Text></View><View style={styles.actions}><PrimaryButton label={loading ? 'Carregando...' : 'Continuar com Google'} onPress={() => void login()} disabled={loading || !configured} />{!configured && <Text style={styles.help}>Configure o Supabase para habilitar o Google.</Text>}<PrimaryButton label="Continuar sem conta" onPress={enter} secondary />{error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}</View></Screen>;
}

const styles = StyleSheet.create({ screen: { flex: 1, justifyContent: 'space-between', paddingVertical: spacing.huge }, content: { marginTop: spacing.huge }, icon: { width: 68, height: 68, borderRadius: radius.pill, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl }, title: { ...typography.display, color: colors.ink }, body: { ...typography.body, color: colors.muted, marginTop: spacing.lg }, actions: { gap: spacing.md }, help: { ...typography.caption, color: colors.muted, textAlign: 'center' }, error: { ...typography.caption, color: '#A33', textAlign: 'center' } });
