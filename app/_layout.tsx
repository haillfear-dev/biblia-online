import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeBibleDatabase } from '@/data/sqlite/SQLiteBibleDataSource';
import { AuthProvider } from '@/auth/AuthProvider';
import { colors } from '@/theme/tokens';
const bibleAsset = require('../assets/bible.db');

function PreparingBible() {
  return <View style={styles.preparing}><Text style={styles.preparingText}>Preparando sua Bíblia...</Text></View>;
}

export default function RootLayout() {
  return <SafeAreaProvider><StatusBar style="dark" backgroundColor={colors.background} /><Suspense fallback={<PreparingBible />}><SQLiteProvider databaseName="almeida-1911-v1.db" assetSource={{ assetId: bibleAsset }} onInit={initializeBibleDatabase} useSuspense><AuthProvider><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'fade' }} /></AuthProvider></SQLiteProvider></Suspense></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  preparing: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  preparingText: { color: colors.ink, fontSize: 17 },
});
