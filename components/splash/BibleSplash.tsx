import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const openBible = require('../../assets/splash/bible-open-premium.png');
const dove = require('../../assets/splash/dove-premium.png');

type BibleSplashProps = {
  appReady: boolean;
  onFinished: () => void;
};

export function BibleSplash({ appReady, onFinished }: BibleSplashProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const compositionOpacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0.04)).current;
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const initialProgress = useRef<Animated.CompositeAnimation | null>(null);
  const completing = useRef(false);

  const availableHeight = height - insets.top - insets.bottom;
  const verticalScale = Math.max(0.78, Math.min(availableHeight / 790, 1.08));
  const contentWidth = Math.min(width - 24, 520);
  const doveWidth = Math.min(width * 0.22, 132) * verticalScale;
  const bibleWidth = Math.min(width * 0.9, 460);
  const titleSize = Math.max(30, Math.min(width * 0.088, 38));
  const trackWidth = Math.min(width * 0.56, 280);
  const identityGap = 13 * verticalScale;
  const bibleGap = 22 * verticalScale;
  const loadingGap = 18 * verticalScale;

  useEffect(() => {
    Animated.timing(compositionOpacity, {
      toValue: 1,
      duration: 480,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    const animation = Animated.timing(progress, {
      toValue: 0.86,
      duration: 1900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    initialProgress.current = animation;
    animation.start();
    return () => animation.stop();
  }, [compositionOpacity, progress]);

  useEffect(() => {
    if (!appReady || completing.current) return;
    completing.current = true;
    initialProgress.current?.stop();
    Animated.sequence([
      Animated.timing(progress, {
        toValue: 1,
        duration: 340,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.delay(190),
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => finished && onFinished());
  }, [appReady, onFinished, progress, splashOpacity]);

  return (
    <Animated.View
      accessibilityLabel="Bíblia Online carregando"
      accessibilityRole="progressbar"
      style={[styles.screen, { opacity: splashOpacity }]}
    >
      <View pointerEvents="none" style={styles.atmosphere}>
        <View style={[styles.ambientLight, { width: width * 1.35, height: height * 0.7 }]} />
        <View style={styles.warmBase} />
      </View>

      <Animated.View
        style={[
          styles.composition,
          {
            width: contentWidth,
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 18,
            opacity: compositionOpacity,
          },
        ]}
      >
        <View style={[styles.doveWrap, { width: doveWidth, height: doveWidth * 0.886, marginBottom: identityGap }]}>
          <Image source={dove} resizeMode="contain" style={styles.image} />
        </View>

        <View style={styles.identity}>
          <Text style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 1.12 }]}>Bíblia Online</Text>
          <View style={styles.ornament} accessibilityElementsHidden>
            <View style={styles.ornamentLine} />
            <View style={styles.diamond} />
            <View style={styles.ornamentLine} />
          </View>
          <Text style={[styles.subtitle, { fontSize: Math.max(14, 15 * verticalScale) }]}>A Palavra que transforma.</Text>
        </View>

        <View style={[styles.bibleWrap, { width: bibleWidth, height: bibleWidth * 0.62, marginTop: bibleGap }]}>
          <Image source={openBible} resizeMode="contain" style={styles.image} />
        </View>

        <View style={[styles.loading, { marginTop: loadingGap }]}>
          <Text style={styles.loadingText}>Carregando...</Text>
          <View style={[styles.track, { width: trackWidth }]}>
            <Animated.View
              style={[
                styles.progress,
                { width: progress.interpolate({ inputRange: [0, 1], outputRange: [0, trackWidth] }) },
              ]}
            />
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
  },
  atmosphere: { ...StyleSheet.absoluteFillObject, alignItems: 'center' },
  ambientLight: {
    position: 'absolute',
    top: '-8%',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 240, 207, 0.22)',
  },
  warmBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '34%',
    backgroundColor: 'rgba(247, 240, 228, 0.42)',
  },
  composition: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
  doveWrap: { flexShrink: 1 },
  identity: { alignItems: 'center' },
  title: {
    color: '#38281D',
    fontFamily: 'serif',
    fontWeight: '400',
    letterSpacing: -0.7,
    textAlign: 'center',
  },
  ornament: { marginTop: 8, flexDirection: 'row', alignItems: 'center' },
  ornamentLine: { width: 52, height: StyleSheet.hairlineWidth, backgroundColor: '#C89532' },
  diamond: {
    width: 7,
    height: 7,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#C89532',
    transform: [{ rotate: '45deg' }],
  },
  subtitle: { marginTop: 11, color: '#796D62', fontWeight: '400', letterSpacing: 0.35 },
  bibleWrap: { flexShrink: 1 },
  loading: { alignItems: 'center', paddingBottom: 2 },
  loadingText: { marginBottom: 12, color: '#6F5326', fontSize: 14, letterSpacing: 0.25 },
  track: { height: 4, overflow: 'hidden', borderRadius: 999, backgroundColor: '#E8DFD1' },
  progress: { height: 4, borderRadius: 999, backgroundColor: '#C89B3C' },
});