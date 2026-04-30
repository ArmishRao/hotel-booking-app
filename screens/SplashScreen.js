import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const BRAND_NAME = 'PƎLAGIA';

export default function SplashScreen({ onFinish }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const indicatorOpacity = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(indicatorOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 400,
          delay: 150,
          useNativeDriver: true,
        }),
      ]).start();

      if (onFinish) {
        setTimeout(onFinish, 2000);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3AADBE" />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Text style={styles.logoText}>{BRAND_NAME}</Text>
      </Animated.View>

      <View style={styles.bottomArea}>
        <Animated.View
          style={[styles.indicatorRow, { opacity: indicatorOpacity }]}
        >
          <View style={styles.indicator} />
          <Animated.View style={[styles.dot, { opacity: dotOpacity }]} />
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
    fontFamily: 'Montserrat-Medium',
    fontSize: 28,
    fontWeight: '500',
    letterSpacing: 6,
    color: '#FFFFFF',
    opacity: 0.97,
  },
  bottomArea: {
    position: 'absolute',
    bottom: 28,
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    marginLeft: 6,
  },
});