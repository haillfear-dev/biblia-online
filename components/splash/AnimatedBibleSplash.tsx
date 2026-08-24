import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

const closedBible = require('../../assets/splash/bible-closed.png');
const openBible = require('../../assets/splash/bible-open.png');
const dove = require('../../assets/splash/dove.png');
const glow = require('../../assets/splash/glow.png');

type AnimatedBibleSplashProps = {
  appReady: boolean;
  onFinished: () => void;
};

export function AnimatedBibleSplash({ appReady, onFinished }: AnimatedBibleSplashProps) {
  const { width, height } = useWindowDimensions();
  const [visualComplete, setVisualComplete] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const finished = useRef(false);
  const closedProgress = useRef(new Animated.Value(0)).current;
  const openProgress = useRef(new Animated.Value(0)).current;
  const lightProgress = useRef(new Animated.Value(0)).current;
  const doveProgress = useRef(new Animated.Value(0)).current;
  const splashOpacity = useRef(new Animated.Value(1)).current;

  const bookWidth = Math.min(width * 0.84, 420);
  const bookBottom = Math.max(24, height * 0.08);
  const openHeight = bookWidth * 0.52;
  const closedWidth = bookWidth * 0.62;
  const closedHeight = closedWidth * 0.775;
  const doveWidth = Math.min(width * 0.49, 230);
  const doveStartY = height - bookBottom - openHeight * 0.82;
  const doveTravel = doveStartY + doveWidth * 0.9;

  const timings = useMemo(() => reduceMotion ? {
    appear: 180, pause: 80, open: 260, light: 160, dove: 420,
  } : {
    appear: 260, pause: 170, open: 440, light: 180, dove: 1050,
  }, [reduceMotion]);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => mounted && setReduceMotion(enabled));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(120),
      Animated.timing(closedProgress, {
        toValue: 1, duration: timings.appear, easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
      Animated.delay(timings.pause),
      Animated.parallel([
        Animated.timing(closedProgress, {
          toValue: 2, duration: timings.open, easing: Easing.inOut(Easing.cubic), useNativeDriver: true,
        }),
        Animated.timing(openProgress, {
          toValue: 1, duration: timings.open, easing: Easing.inOut(Easing.cubic), useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(lightProgress, {
          toValue: 1, duration: timings.light, easing: Easing.out(Easing.quad), useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(reduceMotion ? 20 : 80),
          Animated.timing(doveProgress, {
            toValue: 1, duration: timings.dove, easing: Easing.inOut(Easing.sin), useNativeDriver: true,
          }),
        ]),
      ]),
    ]);
    animation.start(() => setVisualComplete(true));
    // An animation must never be able to hold the application indefinitely.
    const fallback = setTimeout(() => setVisualComplete(true), 3000);
    return () => {
      animation.stop();
      clearTimeout(fallback);
    };
  }, [closedProgress, doveProgress, lightProgress, openProgress, reduceMotion, timings]);

  useEffect(() => {
    if (!appReady || !visualComplete || finished.current) return;
    finished.current = true;
    Animated.timing(splashOpacity, {
      toValue: 0, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true,
    }).start(() => onFinished());
  }, [appReady, onFinished, splashOpacity, visualComplete]);

  return (
    <Animated.View
      accessibilityLabel="Bíblia Sagrada abrindo enquanto o aplicativo é preparado"
      accessibilityRole="progressbar"
      style={[styles.container, { opacity: splashOpacity }]}
    >
      <Animated.View style={[
        styles.dove,
        {
          width: doveWidth,
          height: doveWidth * 0.886,
          top: doveStartY,
          opacity: doveProgress.interpolate({ inputRange: [0, 0.1, 0.82, 1], outputRange: [0, 0.82, 1, 0] }),
          transform: [
            { translateY: doveProgress.interpolate({ inputRange: [0, 1], outputRange: [0, -doveTravel] }) },
            { scale: doveProgress.interpolate({ inputRange: [0, 1], outputRange: [0.42, reduceMotion ? 0.9 : 1.04] }) },
          ],
        },
      ]}>
        <Image source={dove} resizeMode="contain" style={styles.fill} />
      </Animated.View>

      <Animated.Image
        source={glow}
        resizeMode="contain"
        style={[
          styles.glow,
          {
            width: bookWidth * 0.82,
            height: bookWidth * 0.82,
            bottom: bookBottom + openHeight * 0.08,
            opacity: lightProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 0.72] }),
            transform: [{ scale: lightProgress.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
          },
        ]}
      />

      <Animated.View style={[
        styles.book,
        {
          width: bookWidth,
          height: openHeight,
          bottom: bookBottom,
          opacity: openProgress,
          transform: [
            { scaleX: openProgress.interpolate({ inputRange: [0, 1], outputRange: [0.62, 1] }) },
            { scaleY: openProgress.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) },
          ],
        },
      ]}>
        <Image source={openBible} resizeMode="contain" style={styles.fill} />
      </Animated.View>

      <Animated.View style={[
        styles.closedBook,
        {
          width: closedWidth,
          height: closedHeight,
          bottom: bookBottom,
          opacity: closedProgress.interpolate({ inputRange: [0, 1, 1.72, 2], outputRange: [0, 1, 0.74, 0] }),
          transform: [
            { scale: closedProgress.interpolate({ inputRange: [0, 1, 2], outputRange: [0.97, 1, 0.84] }) },
            { scaleX: closedProgress.interpolate({ inputRange: [0, 1, 2], outputRange: [1, 1, 0.72] }) },
            { translateY: closedProgress.interpolate({ inputRange: [0, 1, 2], outputRange: [8, 0, 18] }) },
          ],
        },
      ]}>
        <Image source={closedBible} resizeMode="contain" style={styles.fill} />
        <View pointerEvents="none" style={styles.coverTitle}>
          <Text style={[styles.coverText, { fontSize: closedWidth * 0.071 }]}>BÍBLIA</Text>
          <Text style={[styles.coverText, { fontSize: closedWidth * 0.071 }]}>SAGRADA</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
    overflow: 'hidden',
    backgroundColor: '#FFFEFC',
  },
  fill: { width: '100%', height: '100%' },
  book: { position: 'absolute', alignSelf: 'center' },
  closedBook: { position: 'absolute', alignSelf: 'center' },
  glow: { position: 'absolute', alignSelf: 'center' },
  dove: { position: 'absolute', alignSelf: 'center', zIndex: 3 },
  coverTitle: {
    position: 'absolute',
    top: '35%',
    left: '24%',
    right: '16%',
    alignItems: 'center',
  },
  coverText: {
    color: '#D3A34F',
    fontFamily: 'serif',
    fontWeight: '700',
    letterSpacing: 1.2,
    lineHeight: 26,
    textShadowColor: 'rgba(55, 28, 12, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
