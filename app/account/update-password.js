import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';
import { auth } from '../../firebase/firebaseConfig';
import { updatePassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

// ─── SVG ICONS ───────────────────────────────────────────────────────

const IconArrowLeft = ({ size = 22, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const IconLock = ({ size = 20, color = '#3aa0b8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const IconEye = ({ size = 20, color = '#94aab0' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Circle cx="12" cy="12" r="3" />
  </Svg>
);

const IconEyeOff = ({ size = 20, color = '#94aab0' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <Line x1="1" y1="1" x2="23" y2="23" />
  </Svg>
);

const IconShield = ({ size = 48, color = 'rgba(255,255,255,0.9)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────
export default function UpdatePassword() {
  const router = useRouter();
  const [newPassword, setNewPassword]   = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);

  const handleUpdatePassword = async () => {
    try {
      if (newPassword.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }

      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'No user logged in');
        return;
      }

      await updatePassword(user, newPassword);

      Alert.alert('Success', 'Your password has been updated successfully!');
      setNewPassword('');
      router.replace('/settings');

    } catch (error) {
      console.log(error);

      if (error.code === 'auth/requires-recent-login') {
        Alert.alert('Security Required', 'Please re-login before changing password.');
        router.push({ pathname: '/account/reauth', params: { newPassword } });
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#3aa0b8" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── HERO ── */}
          <View style={s.hero}>
            <View style={s.heroCircle1} />
            <View style={s.heroCircle2} />

            <TouchableOpacity
              style={s.backBtn}
              onPress={() => router.back()}
              activeOpacity={0.75}
            >
              <IconArrowLeft size={22} color="#fff" />
            </TouchableOpacity>

            <View style={s.shieldWrap}>
              <IconShield size={48} />
            </View>

            <Text style={s.heroTitle}>Update Password</Text>
            <Text style={s.heroSub}>Set a new password for your account</Text>
          </View>

          {/* ── FORM CARD ── */}
          <View style={s.card}>

            <Text style={s.inputLabel}>New Password</Text>

            <View style={s.inputWrap}>
              <View style={s.inputIcon}>
                <IconLock size={18} color="#3aa0b8" />
              </View>

              <TextInput
                style={s.input}
                placeholder="Enter new password"
                placeholderTextColor="#b0c4ca"
                secureTextEntry={!showPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={s.eyeBtn}
                onPress={() => setShowPassword((v) => !v)}
                activeOpacity={0.7}
              >
                {showPassword
                  ? <IconEyeOff size={19} color="#94aab0" />
                  : <IconEye    size={19} color="#94aab0" />
                }
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[s.button, loading && s.buttonDisabled]}
              onPress={handleUpdatePassword}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.buttonText}>Update Password</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={s.cancelBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────
const PRIMARY = '#3aa0b8';
const BG      = '#f0f4f5';

const s = StyleSheet.create({

  safe:          { flex: 1, backgroundColor: PRIMARY },
  scrollContent: { flexGrow: 1 },

  // Hero
  hero: {
    backgroundColor: PRIMARY,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 52,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -60, right: -50,
  },
  heroCircle2: {
    position: 'absolute', width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -20, left: -40,
  },
  backBtn: {
    alignSelf: 'flex-start',
    width: 38, height: 38,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 11,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 22,
  },
  shieldWrap: {
    width: 80, height: 80,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: { fontSize: 22, fontWeight: '700', color: '#fff', letterSpacing: 0.2, marginBottom: 6 },
  heroSub:   { fontSize: 13.5, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },

  // Card
  card: {
    backgroundColor: BG,
    marginTop: -22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 20,
    flex: 1,
  },

  // Input
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8aa5ac',
    textTransform: 'uppercase',
    letterSpacing: 0.9,
    marginBottom: 10,
    marginLeft: 2,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e0ecef',
    paddingHorizontal: 14,
    height: 54,
    marginBottom: 24,
    shadowColor: '#3aa0b8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1a3a42',
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 8,
  },

  // Button
  button: {
    backgroundColor: PRIMARY,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 14,
  },
  buttonDisabled: { opacity: 0.65 },
  buttonText: { fontSize: 15.5, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },

  cancelBtn:  { alignItems: 'center', paddingVertical: 10 },
  cancelText: { fontSize: 14, color: '#94aab0', fontWeight: '500' },
})