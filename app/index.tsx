import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { colors } from '@/theme/tokens';

export default function SplashScreen() {
  const doveX = useRef(new Animated.Value(-Dimensions.get('window').width * 0.7)).current;
  const doveOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(350),
      Animated.parallel([
        Animated.timing(doveX, { toValue: Dimensions.get('window').width * 0.7, duration: 1400, useNativeDriver: true }),
        Animated.sequence([Animated.timing(doveOpacity, { toValue: 1, duration: 250, useNativeDriver: true }), Animated.delay(850), Animated.timing(doveOpacity, { toValue: 0, duration: 300, useNativeDriver: true })]),
      ]),
    ]);
    animation.start(({ finished }) => finished && router.replace('/onboarding'));
    return () => animation.stop();
  }, [doveOpacity, doveX]);
  return <View style={styles.container}><View style={styles.book}><Feather name="book-open" size={46} color={colors.ink} /></View><Animated.View accessibilityLabel="Pomba em movimento" style={[styles.dove, { opacity: doveOpacity, transform: [{ translateX: doveX }] }]}><Feather name="feather" size={30} color={colors.gold} /></Animated.View></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, book: { position: 'absolute' }, dove: { position: 'absolute', top: '42%' } });
