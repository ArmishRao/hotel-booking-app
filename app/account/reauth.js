import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';
import { auth } from '../../firebase/firebaseConfig';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../context/ThemeContext'; // ← ADD

const IconArrowLeft = ({ size = 22, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const IconMail = ({ size = 19, color = '#3aa0b8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Polyline points="22,6 12,13 2,6" />
  </Svg>
);

const IconLock = ({ size = 19, color = '#3aa0b8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const IconEye = ({ size = 19, color = '#94aab0' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Circle cx="12" cy="12" r="3" />
  </Svg>
);

const IconEyeOff = ({ size = 19, color = '#94aab0' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <Line x1="1" y1="1" x2="23" y2="23" />
  </Svg>
);

const IconShieldCheck = ({ size = 46, color = 'rgba(255,255,255,0.92)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Polyline points="9 12 11 14 15 10" />
  </Svg>
);

const IconAlertCircle = ({ size = 16, color = '#dc4a4a' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="8" x2="12" y2="12" />
    <Line x1="12" y1="16" x2="12.01" y2="16" />
  </Svg>
);

const IconCheckCircle = ({ size = 16, color = '#22c55e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Polyline points="22 4 12 14.01 9 11.01" />
  </Svg>
);

export default function ReAuthScreen() {
  const router = useRouter();
  const { newPassword } = useLocalSearchParams();

  // ── DARK MODE ──
  const { theme } = useTheme();
  const { colors, darkMode } = theme;

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [message, setMessage]           = useState('');
  const [success, setSuccess]           = useState(false);

  const handleReauth = async () => {
    // ... same as before, no changes needed
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: PRIMARY }]}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── HERO — stays brand-colored, no dark mode change needed ── */}
          <View style={s.hero}>
            <View style={s.heroCircle1} />
            <View style={s.heroCircle2} />

            <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
              <IconArrowLeft size={22} color="#fff" />
            </TouchableOpacity>

            <View style={s.shieldWrap}>
              <IconShieldCheck size={46} />
            </View>

            <Text style={s.heroTitle}>Verify Identity</Text>
            <Text style={s.heroSub}>
              For your security, please confirm your credentials before making changes
            </Text>
          </View>

          {/* ── FORM CARD ── */}
          {/* ── DARK MODE: card background ── */}
          <View style={[s.card, { backgroundColor: colors.background }]}>

            {/* Info note */}
            {/* ── DARK MODE: info box bg ── */}
            <View style={[s.infoBox, { backgroundColor: colors.card }]}>
              <View style={s.infoLine} />
              {/* ── DARK MODE: info text ── */}
              <Text style={[s.infoText, { color: darkMode ? '#5a8a95' : '#4a7a85' }]}>
                Re-enter your login details to confirm it's really you
              </Text>
            </View>

            {/* Email */}
            {/* ── DARK MODE: label ── */}
            <Text style={[s.inputLabel, { color: darkMode ? '#5a8a95' : '#8aa5ac' }]}>
              Email Address
            </Text>
            {/* ── DARK MODE: input wrap ── */}
            <View style={[
              s.inputWrap,
              {
                backgroundColor: colors.card,
                borderColor: darkMode ? '#1e3d47' : '#e0ecef',
              }
            ]}>
              <View style={s.inputIcon}>
                <IconMail size={18} color="#3aa0b8" />
              </View>
              <TextInput
                style={[s.input, { color: colors.text }]}
                placeholder="your@email.com"
                placeholderTextColor={darkMode ? '#5a7a82' : '#b0c4ca'}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <Text style={[s.inputLabel, { color: darkMode ? '#5a8a95' : '#8aa5ac' }]}>
              Current Password
            </Text>
            <View style={[
              s.inputWrap,
              {
                backgroundColor: colors.card,
                borderColor: darkMode ? '#1e3d47' : '#e0ecef',
              }
            ]}>
              <View style={s.inputIcon}>
                <IconLock size={18} color="#3aa0b8" />
              </View>
              <TextInput
                style={[s.input, { color: colors.text }]}
                placeholder="Enter your current password"
                placeholderTextColor={darkMode ? '#5a7a82' : '#b0c4ca'}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={s.eyeBtn}
                onPress={() => setShowPassword((v) => !v)}
                activeOpacity={0.7}
              >
                {showPassword
                  ? <IconEyeOff size={19} color={darkMode ? '#5a7a82' : '#94aab0'} />
                  : <IconEye    size={19} color={darkMode ? '#5a7a82' : '#94aab0'} />
                }
              </TouchableOpacity>
            </View>

            {/* Status message — error/success colors are semantic, no dark mode change needed */}
            {message !== '' && (
              <View style={[s.messageBox, success ? s.messageBoxSuccess : s.messageBoxError]}>
                <View style={s.messageIcon}>
                  {success
                    ? <IconCheckCircle size={16} color="#22c55e" />
                    : <IconAlertCircle size={16} color="#dc4a4a" />
                  }
                </View>
                <Text style={[s.messageText, success ? s.messageTextSuccess : s.messageTextError]}>
                  {message}
                </Text>
              </View>
            )}

            {/* Verify button — brand color, stays the same */}
            <TouchableOpacity
              style={[s.button, loading && s.buttonDisabled]}
              onPress={handleReauth}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.buttonText}>Verify & Update</Text>
              }
            </TouchableOpacity>

            {/* Cancel */}
            {/* ── DARK MODE: cancel text ── */}
            <TouchableOpacity style={s.cancelBtn} onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={[s.cancelText, { color: darkMode ? '#5a7a82' : '#94aab0' }]}>
                Go back
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── STYLES — remove hardcoded bg colors that are now set inline ──────
const PRIMARY = '#3aa0b8';

const s = StyleSheet.create({

  safe:          { flex: 1 },            // ← bg set inline from PRIMARY
  scrollContent: { flexGrow: 1 },

  // Hero — always brand-colored, no changes
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
    alignSelf: 'flex-start', width: 38, height: 38,
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
  heroTitle: { fontSize: 22, fontWeight: '700', color: '#fff', letterSpacing: 0.2, marginBottom: 8 },
  heroSub:   { fontSize: 13, color: 'rgba(255,255,255,0.68)', textAlign: 'center', lineHeight: 19, paddingHorizontal: 10 },

  // Card — bg now set inline
  card: {
    marginTop: -22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
    flex: 1,
  },

  // Info box — bg now set inline
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    gap: 12,
    shadowColor: '#3aa0b8',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoLine: { width: 3, height: '100%', minHeight: 32, backgroundColor: PRIMARY, borderRadius: 2 },
  infoText:  { flex: 1, fontSize: 13, lineHeight: 19, fontWeight: '400' }, // color set inline

  // Input — label color and wrap bg/border set inline
  inputLabel: {
    fontSize: 12, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.9,
    marginBottom: 9, marginLeft: 2,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, borderWidth: 1.5,
    paddingHorizontal: 14, height: 54,
    marginBottom: 18,
    shadowColor: '#3aa0b8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  inputIcon: { marginRight: 10 },
  input:     { flex: 1, fontSize: 15 },   // color set inline
  eyeBtn:    { padding: 4, marginLeft: 8 },

  // Message — semantic colors, unchanged
  messageBox:         { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 18, gap: 10 },
  messageBoxError:    { backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca' },
  messageBoxSuccess:  { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0' },
  messageIcon:        { flexShrink: 0 },
  messageText:        { flex: 1, fontSize: 13.5, fontWeight: '500', lineHeight: 19 },
  messageTextError:   { color: '#b91c1c' },
  messageTextSuccess: { color: '#15803d' },

  // Button — brand color, unchanged
  button: {
    backgroundColor: PRIMARY, height: 54, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: PRIMARY, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28, shadowRadius: 10, elevation: 4,
    marginBottom: 14,
  },
  buttonDisabled: { opacity: 0.65 },
  buttonText:     { fontSize: 15.5, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },

  cancelBtn:  { alignItems: 'center', paddingVertical: 10 },
  cancelText: { fontSize: 14, fontWeight: '500' },  // color set inline
});