import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProfileActivityCard } from '@/components/ProfileActivityCard';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { useUserBibleData } from '@/hooks/useUserBibleData';
import { colors, radius, spacing, typography } from '@/theme/tokens';

const shortcuts = [
  { label: 'Favoritos', route: '/profile/favorites' },
  { label: 'Versículos grifados', route: '/profile/highlights' },
  { label: 'Anotações', route: '/profile/notes' },
  { label: 'Histórico de leitura', route: '/profile/history' },
] as const;
const authRoute = '/auth' as Href;

export default function Profile() {
  const { session, signOut } = useAuth();
  const { data, refresh } = useUserBibleData();
  const metadata = session?.user.user_metadata;
  const name = metadata?.full_name ?? metadata?.name ?? session?.user.email;
  const avatar = metadata?.avatar_url ?? metadata?.picture;

  useFocusEffect(useCallback(() => {
    void refresh();
  }, [refresh]));

  const activity = {
    completedDevotionals: 0,
    savedVerses: data.favorites.length,
    highlights: data.highlights.length,
    notes: data.notes.length,
  };

  return (
    <Screen>
      <AppHeader title="Perfil" />
      <View style={styles.identity}>
        {avatar ? (
          <Image accessibilityLabel={`Foto de ${name}`} source={{ uri: avatar }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatar}>
            <Feather name="user" size={32} color={colors.muted} />
          </View>
        )}
        <Text style={styles.name}>{name ?? 'Visitante'}</Text>
        {session?.user.email && <Text style={styles.email}>{session.user.email}</Text>}
      </View>
      {session ? (
        <PrimaryButton label="Sair" onPress={() => void signOut()} secondary />
      ) : (
        <PrimaryButton label="Entrar com Google" onPress={() => router.push(authRoute)} />
      )}
      <ProfileActivityCard metrics={activity} />
      <SectionHeader title="Sua biblioteca" />
      <View>
        {shortcuts.map((item) => (
          <Pressable
            accessibilityRole="button"
            key={item.label}
            onPress={() => router.push(item.route)}
            style={styles.shortcut}
          >
            <Text style={styles.shortcutText}>{item.label}</Text>
            <Feather name="chevron-right" size={19} color={colors.muted} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
  },
  name: {
    ...typography.heading,
    color: colors.ink,
    marginTop: spacing.md,
  },
  email: {
    ...typography.caption,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  shortcut: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  shortcutText: {
    ...typography.body,
    flex: 1,
    color: colors.ink,
  },
});
