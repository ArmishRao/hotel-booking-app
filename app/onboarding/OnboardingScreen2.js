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

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen2() {
  const router = useRouter();

  const contentY = useRef(new Animated.Value(40)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(contentY, {
        toValue: 0,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8E8E8" />

      {/* TOP IMAGE AREA */}
      <View style={styles.imageArea}>

        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Menu button */}
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>

        {/* Replace with your actual image:
            <Image source={require('../../assets/onboarding2.png')} style={styles.image} resizeMode="cover" />
        */}
        <View style={styles.imagePlaceholder} />

      </View>

      {/* BOTTOM WHITE CARD */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity: contentOpacity,
            transform: [{ translateY: contentY }],
          },
        ]}
      >
        <View style={styles.textBlock}>
          <Text style={styles.title}>Gentle Journeys{'\n'}Begin Here</Text>
          <Text style={styles.subtitle}>
            A Soothing Way To Plan Your{'\n'}Next Escape.
          </Text>
        </View>

        {/* DOTS + NEXT BUTTON */}
        <View style={styles.bottomRow}>
          <View style={styles.dotsRow}>
            {/* Dot 1 — inactive */}
            <View style={styles.dot} />
            {/* Dot 2 — active */}
            <View style={[styles.dot, styles.dotActive]} />
            {/* Dot 3 — inactive (remove if only 2 screens) */}
            <View style={styles.dot} />
          </View>

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
    flex: 1,
    backgroundColor: '#E8E8E8',
  },

  /* IMAGE AREA */
  imageArea: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#D8D8D8',
  },

  /* BACK BUTTON */
  backButton: {
    position: 'absolute',
    top: 52,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  backArrow: {
    fontSize: 18,
    color: '#222',
  },

  /* MENU BUTTON */
  menuButton: {
    position: 'absolute',
    top: 52,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  menuDots: {
    fontSize: 20,
    color: '#222',
    lineHeight: 22,
  },

  /* BOTTOM CARD */
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 44,
  },

  textBlock: {
    marginBottom: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111111',
    lineHeight: 40,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#999999',
    lineHeight: 20,
  },

  /* BOTTOM ROW */
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D0D0D0',
  },
  dotActive: {
    width: 24,
    borderRadius: 4,
    backgroundColor: '#333333',
  },

  /* NEXT BUTTON */
  nextButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#3AADBE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3AADBE',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  nextArrow: {
    fontSize: 22,
    color: '#FFFFFF',
  },
});