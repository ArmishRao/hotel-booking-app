import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function OnbaordingScreen1({ navigation }) {
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />

      {}
      <View style={styles.imageArea}>
        {}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {}
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>

        {}
        <View style={styles.imagePlaceholder} />
      </View>

      {}
      <Animated.View
        style={[
          styles.card,
          {
            opacity: contentOpacity,
            transform: [{ translateY: contentY }],
          },
        ]}
      >
        {}
        <View style={styles.textBlock}>
          <Text style={styles.title}>Welcome to{'\n'}Pelagia</Text>
          <Text style={styles.subtitle}>
            Enjoy A Peaceful Stay That Fits Your{'\n'}
            Lifestyle—Simple, Calm. And Effortless.
          </Text>
        </View>

        {}
        <View style={styles.bottomRow}>
          {}
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

           { }
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation?.navigate('Onboarding2')}
          >
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

  imageArea: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    position: 'relative',
  },

  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#D6D6D6',
  },

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

  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 36,
  },

  textBlock: {
    marginBottom: 32,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111111',
    lineHeight: 38,
    marginBottom: 12,
    fontFamily: 'Montserrat-Bold', 
  },

  subtitle: {
    fontSize: 13,
    color: '#888888',
    lineHeight: 20,
    fontFamily: 'Montserrat-Regular', 
  },

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

  nextButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#3AADBE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3AADBE',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  nextArrow: {
    fontSize: 22,
    color: '#FFFFFF',
  },
});