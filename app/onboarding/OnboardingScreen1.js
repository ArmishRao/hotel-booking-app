import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext'; // ← ADD

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen1() {
  const router = useRouter();

  // ── DARK MODE ──
  const { theme } = useTheme();
  const { colors, darkMode } = theme;

  const contentY       = useRef(new Animated.Value(40)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const autoTimer      = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1, duration: 500, delay: 200, useNativeDriver: true,
      }),
      Animated.timing(contentY, {
        toValue: 0, duration: 500, delay: 200, useNativeDriver: true,
      }),
    ]).start();

    autoTimer.current = setTimeout(() => { goToNext(); }, 4000);
    return () => clearTimeout(autoTimer.current);
  }, []);

  const goToNext = () => {
    clearTimeout(autoTimer.current);
    router.push('/onboarding/OnboardingScreen2');
  };

  const goBack = () => {
    clearTimeout(autoTimer.current);
    router.back();
  };

  return (
    // ── DARK MODE: container bg ──
    <View style={[styles.container, { backgroundColor: darkMode ? colors.background : '#E8E8E8' }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={darkMode ? colors.background : '#E0E0E0'}
      />

      {/* Top image area */}
      {/* ── DARK MODE: image area bg ── */}
      <View style={[styles.imageArea, { backgroundColor: darkMode ? '#0e2d36' : '#E0E0E0' }]}>

        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>

        {/* ── DARK MODE: image placeholder bg ── */}
        <View style={[styles.imagePlaceholder, { backgroundColor: darkMode ? '#1e3d47' : '#D6D6D6' }]} />
      </View>

      {/* Bottom card */}
      {/* ── DARK MODE: card bg ── */}
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: colors.card },
          { opacity: contentOpacity, transform: [{ translateY: contentY }] },
        ]}
      >
        <View style={styles.textBlock}>
          {/* ── DARK MODE: title ── */}
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome to{'\n'}Pelagia
          </Text>
          {/* ── DARK MODE: subtitle ── */}
          <Text style={[styles.subtitle, { color: darkMode ? '#5a8a95' : '#888888' }]}>
            Enjoy A Peaceful Stay That Fits Your{'\n'}
            Lifestyle—Simple, Calm. And Effortless.
          </Text>
        </View>

        {/* Bottom row: dots + next button */}
        <View style={styles.bottomRow}>
          <View style={styles.dotsRow}>
            {/* ── DARK MODE: active dot ── */}
            <View style={[styles.dot, styles.dotActive, { backgroundColor: darkMode ? '#3aa0b8' : '#333333' }]} />
            {/* ── DARK MODE: inactive dot ── */}
            <View style={[styles.dot, { backgroundColor: darkMode ? '#1e3d47' : '#D0D0D0' }]} />
          </View>

          {/* Next button — brand color, unchanged */}
          <TouchableOpacity style={styles.nextButton} onPress={goToNext}>
            <Text style={styles.nextArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                          // bg set inline
  },
  imageArea: {
    flex: 1,
    position: 'relative',            // bg set inline
  },
  imagePlaceholder: {
    flex: 1,                          // bg set inline
  },
  backButton: {
    position: 'absolute', top: 52, left: 20, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FFFFFF',      // always white — sits on image
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  backArrow: { fontSize: 18, color: '#222' },
  menuButton: {
    position: 'absolute', top: 52, right: 20, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FFFFFF',      // always white — sits on image
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  menuDots: { fontSize: 20, color: '#222', lineHeight: 22 },

  card: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 28, paddingTop: 32, paddingBottom: 36, // bg set inline
  },
  textBlock: { marginBottom: 32 },
  title:    { fontSize: 30, fontWeight: '700', lineHeight: 38, marginBottom: 12 }, // color set inline
  subtitle: { fontSize: 13, lineHeight: 20 },                                      // color set inline

  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dotsRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot:       { width: 8, height: 8, borderRadius: 4 },                            // bg set inline
  dotActive: { width: 24, borderRadius: 4 },                                      // bg set inline

  nextButton: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#3AADBE',      // brand color, unchanged
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#3AADBE', shadowOpacity: 0.35,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 5,
  },
  nextArrow: { fontSize: 22, color: '#FFFFFF' },
});