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
import { auth } from '../../firebase/firebaseConfig';
import { useTheme } from '../../context/ThemeContext'; // ← ADD

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen2() {
  const router = useRouter();

  // ── DARK MODE ──
  const { theme } = useTheme();
  const { colors, darkMode } = theme;

  const contentY       = useRef(new Animated.Value(40)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1, duration: 500, delay: 200, useNativeDriver: true,
      }),
      Animated.timing(contentY, {
        toValue: 0, duration: 500, delay: 200, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const goBack = () => router.back();

  const goToApp = () => {
    const user = auth.currentUser;
    if (user) {
      router.replace('/(tabs)');
    } else {
      router.replace('/auth/login');
    }
  };

  return (
    // ── DARK MODE: container bg ──
    <View style={[styles.container, { backgroundColor: darkMode ? colors.background : '#E8E8E8' }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={darkMode ? colors.background : '#E8E8E8'}
      />

      {/* TOP IMAGE AREA */}
      {/* ── DARK MODE: image area bg ── */}
      <View style={[styles.imageArea, { backgroundColor: darkMode ? '#0e2d36' : '#E0E0E0' }]}>

        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>

        {/* ── DARK MODE: image placeholder bg ── */}
        <View style={[styles.imagePlaceholder, { backgroundColor: darkMode ? '#1e3d47' : '#D8D8D8' }]} />

      </View>

      {/* BOTTOM CARD */}
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
            Gentle Journeys{'\n'}Begin Here
          </Text>
          {/* ── DARK MODE: subtitle ── */}
          <Text style={[styles.subtitle, { color: darkMode ? '#5a8a95' : '#999999' }]}>
            A Soothing Way To Plan Your{'\n'}Next Escape.
          </Text>
        </View>

        {/* DOTS + NEXT BUTTON */}
        <View style={styles.bottomRow}>
          <View style={styles.dotsRow}>
            {/* ── DARK MODE: inactive dots ── */}
            <View style={[styles.dot, { backgroundColor: darkMode ? '#1e3d47' : '#D0D0D0' }]} />
            {/* ── DARK MODE: active dot ── */}
            <View style={[styles.dot, styles.dotActive, { backgroundColor: darkMode ? '#3aa0b8' : '#333333' }]} />
            <View style={[styles.dot, { backgroundColor: darkMode ? '#1e3d47' : '#D0D0D0' }]} />
          </View>

          {/* Next button — brand color, unchanged */}
          <TouchableOpacity style={styles.nextButton} onPress={goToApp}>
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
    paddingHorizontal: 28, paddingTop: 32, paddingBottom: 44, // bg set inline
  },
  textBlock: { marginBottom: 36 },
  title:    { fontSize: 32, fontWeight: '700', lineHeight: 40, marginBottom: 12, letterSpacing: -0.5 }, // color set inline
  subtitle: { fontSize: 13, lineHeight: 20 },                                                           // color set inline

  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dotsRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot:       { width: 8, height: 8, borderRadius: 4 },   // bg set inline
  dotActive: { width: 24, borderRadius: 4 },             // bg set inline

  nextButton: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#3AADBE',      // brand color, unchanged
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#3AADBE', shadowOpacity: 0.4,
    shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  nextArrow: { fontSize: 22, color: '#FFFFFF' },
});