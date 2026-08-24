import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initializeBibleDatabase } from '@/data/sqlite/SQLiteBibleDataSource';
import { AuthProvider } from '@/auth/AuthProvider';
import { colors } from '@/theme/tokens';
import { BibleSplash } from '../components/splash/BibleSplash';

const bibleAsset = require('../assets/bible.db');

function PreparingBible() {
  return <View style={styles.preparing} />;
}

function AppReadySignal({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: 'fade',
      }}
    />
  );
}

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);

  const markReady = useCallback(() => {
    setAppReady(true);
  }, []);

  const hideSplash = useCallback(() => {
    setSplashVisible(false);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        style="dark"
        backgroundColor="#FFFDF8"
      />

      <Suspense fallback={<PreparingBible />}>
        <SQLiteProvider
          databaseName="almeida-1911-v1.db"
          assetSource={{ assetId: bibleAsset }}
          onInit={initializeBibleDatabase}
          useSuspense
        >
          <AuthProvider>
            <AppReadySignal onReady={markReady} />
          </AuthProvider>
        </SQLiteProvider>
      </Suspense>

      {splashVisible && (
        <BibleSplash
          appReady={appReady}
          onFinished={hideSplash}
        />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  preparing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});