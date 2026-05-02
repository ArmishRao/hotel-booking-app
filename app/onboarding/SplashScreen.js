import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

const BRAND_NAME = 'PƎLAGIA';

export default function SplashScreen({ onFinish }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const indicatorOpacity = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1, duration: 700, delay: 300, useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1, tension: 60, friction: 8, delay: 300, useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(indicatorOpacity, {
          toValue: 1, duration: 400, useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 1, duration: 400, delay: 150, useNativeDriver: true,
        }),
        // Button fades in after logo animation
        Animated.timing(buttonOpacity, {
          toValue: 1, duration: 500, delay: 300, useNativeDriver: true,
        }),
      ]).start();

      // Auto-advance after 2 seconds
      if (onFinish) setTimeout(onFinish, 2000);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3AADBE" />

      {/* BRAND NAME */}
      <Animated.View style={[styles.logoContainer, {
        opacity: logoOpacity,
        transform: [{ scale: logoScale }],
      }]}>
        <Text style={styles.logoText}>{BRAND_NAME}</Text>
      </Animated.View>

      {/* BOTTOM AREA: indicator + arrow button */}
      <View style={styles.bottomArea}>
        <Animated.View style={[styles.indicatorRow, { opacity: indicatorOpacity }]}>
          <View style={styles.indicator} />
          <Animated.View style={[styles.dot, { opacity: dotOpacity }]} />
        </Animated.View>

        {/* FORWARD ARROW BUTTON */}
        <Animated.View style={{ opacity: buttonOpacity, marginTop: 28 }}>
          <TouchableOpacity style={styles.arrowButton} onPress={onFinish}>
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3AADBE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '500',
    letterSpacing: 6,
    color: '#FFFFFF',
  },
  bottomArea: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
    width: '100%',
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 120,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.85)',
    marginLeft: 6,
  },
  arrowButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 22,
    color: '#FFFFFF',
  },
});