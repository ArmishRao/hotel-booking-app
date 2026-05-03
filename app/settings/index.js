import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Switch,
  Modal,
} from 'react-native';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

// ─── ICONS ───────────────────────────────────────────────────────────

const IconUser = ({ size = 18, color = '#3aa0b8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const IconLock = ({ size = 18, color = '#3aa0b8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const IconHelp = ({ size = 18, color = '#3aa0b8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <Line x1="12" y1="17" x2="12.01" y2="17" />
  </Svg>
);

const IconFile = ({ size = 18, color = '#7c6fcd' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Line x1="16" y1="13" x2="8" y2="13" />
    <Line x1="16" y1="17" x2="8" y2="17" />
  </Svg>
);

const IconBell = ({ size = 18, color = '#d97706' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const IconMoon = ({ size = 18, color = '#7c6fcd' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Svg>
);

const IconLogOut = ({ size = 18, color = '#dc4a4a' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
);

const IconChevron = ({ size = 17, color = '#b8cdd2' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
);

const IconSettings = ({ size = 44, color = 'rgba(255,255,255,0.92)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

// ─── MENU ITEM COMPONENT ─────────────────────────────────────────────
const MenuItem = ({ icon: Icon, iconBg, iconColor, label, onPress, isLast, right }) => (
  <TouchableOpacity
    style={[s.menuItem, !isLast && s.menuItemBorder]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[s.menuIcon, { backgroundColor: iconBg }]}>
      <Icon size={18} color={iconColor} />
    </View>
    <Text style={s.menuLabel}>{label}</Text>
    {right ?? <IconChevron size={17} color="#b8cdd2" />}
  </TouchableOpacity>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────
export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode]           = useState(false);
  const [logoutModal, setLogoutModal]     = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLogoutModal(false);
      router.replace('/auth/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#3aa0b8" />

      {/* ── HERO ── */}
      <View style={s.hero}>
        <View style={s.heroCircle1} />
        <View style={s.heroCircle2} />

        <View style={s.settingsIconWrap}>
          <IconSettings size={44} />
        </View>

        <Text style={s.heroTitle}>Settings</Text>
        <Text style={s.heroSub}>Manage your account and app preferences</Text>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.body}>

          {/* ── ACCOUNT ── */}
          <Text style={s.sectionLabel}>Account</Text>
          <View style={s.menuCard}>
            <MenuItem
              icon={IconUser}   iconBg="#e4f5f9" iconColor="#3aa0b8"
              label="My Account"
              onPress={() => router.push('/account')}
            />
            <MenuItem
              icon={IconLock}   iconBg="#e4f5f9" iconColor="#3aa0b8"
              label="Change Password"
              onPress={() => router.push('/account/update-password')}
            />
            <MenuItem
              icon={IconHelp}   iconBg="#e4f5f9" iconColor="#3aa0b8"
              label="Help & Support"
              onPress={() => router.push('/support')}
            />
            <MenuItem
              icon={IconFile}   iconBg="#eeebfd" iconColor="#7c6fcd"
              label="Terms & Conditions"
              onPress={() => router.push('/terms')}
              isLast
            />
          </View>

          {/* ── PREFERENCES ── */}
          <Text style={s.sectionLabel}>Preferences</Text>
          <View style={s.menuCard}>
            {/* Notifications toggle */}
            <View style={[s.menuItem, s.menuItemBorder]}>
              <View style={[s.menuIcon, { backgroundColor: '#fef3e2' }]}>
                <IconBell size={18} color="#d97706" />
              </View>
              <Text style={s.menuLabel}>Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#d9e6ea', true: '#3aa0b8' }}
                thumbColor="#fff"
                ios_backgroundColor="#d9e6ea"
              />
            </View>

            {/* Dark mode toggle */}
            <View style={s.menuItem}>
              <View style={[s.menuIcon, { backgroundColor: '#eeebfd' }]}>
                <IconMoon size={18} color="#7c6fcd" />
              </View>
              <Text style={s.menuLabel}>Dark Mode</Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#d9e6ea', true: '#3aa0b8' }}
                thumbColor="#fff"
                ios_backgroundColor="#d9e6ea"
              />
            </View>
          </View>

          {/* ── SESSION ── */}
          <Text style={s.sectionLabel}>Session</Text>
          <View style={s.menuCard}>
            <TouchableOpacity
              style={s.menuItem}
              onPress={() => setLogoutModal(true)}
              activeOpacity={0.7}
            >
              <View style={[s.menuIcon, { backgroundColor: '#fee2e2' }]}>
                <IconLogOut size={18} color="#dc4a4a" />
              </View>
              <Text style={[s.menuLabel, { color: '#dc4a4a' }]}>Log Out</Text>
              <IconChevron size={17} color="#f8a0a0" />
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* ── LOGOUT MODAL ── */}
      <Modal
        transparent
        visible={logoutModal}
        animationType="fade"
        onRequestClose={() => setLogoutModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>

            <View style={s.modalIconWrap}>
              <IconLogOut size={26} color="#dc4a4a" />
            </View>

            <Text style={s.modalTitle}>Log out?</Text>
            <Text style={s.modalSub}>
              You'll be signed out and returned to the login screen.
            </Text>

            <View style={s.modalActions}>
              <TouchableOpacity
                style={s.btnCancel}
                onPress={() => setLogoutModal(false)}
                activeOpacity={0.75}
              >
                <Text style={s.btnCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={s.btnLogout}
                onPress={handleLogout}
                activeOpacity={0.75}
              >
                <Text style={s.btnLogoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────
const PRIMARY = '#3aa0b8';
const BG      = '#f0f4f5';

const s = StyleSheet.create({

  safe:   { flex: 1, backgroundColor: PRIMARY },
  scroll: { backgroundColor: BG },
  scrollContent: { paddingBottom: 48 },

  // Hero
  hero: {
    backgroundColor: PRIMARY,
    paddingTop: 20,
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
  settingsIconWrap: {
    width: 80, height: 80,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: { fontSize: 22, fontWeight: '700', color: '#fff', letterSpacing: 0.2, marginBottom: 6 },
  heroSub:   { fontSize: 13, color: 'rgba(255,255,255,0.68)', textAlign: 'center' },

  // Body
  body: {
    backgroundColor: BG,
    marginTop: -22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 26,
    paddingHorizontal: 16,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8aa5ac',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
    marginBottom: 8,
    marginTop: 4,
  },

  // Menu card
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 13,
  },
  menuItemBorder: {
    borderBottomWidth: 0.6,
    borderBottomColor: '#edf1f2',
  },
  menuIcon: {
    width: 40, height: 40,
    borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '500',
    color: '#1a3a42',
    letterSpacing: 0.1,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10,30,35,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  modalIconWrap: {
    width: 60, height: 60,
    backgroundColor: '#fee2e2',
    borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a3a42', marginBottom: 8 },
  modalSub: {
    fontSize: 13.5, color: '#7fa0a8',
    textAlign: 'center', lineHeight: 20, marginBottom: 24,
  },
  modalActions: { flexDirection: 'row', gap: 10, width: '100%' },
  btnCancel: {
    flex: 1, paddingVertical: 14,
    backgroundColor: '#f0f4f5',
    borderRadius: 14, alignItems: 'center',
  },
  btnCancelText: { fontSize: 14, fontWeight: '600', color: '#4a7a85' },
  btnLogout: {
    flex: 1, paddingVertical: 14,
    backgroundColor: '#dc4a4a',
    borderRadius: 14, alignItems: 'center',
    shadowColor: '#dc4a4a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  btnLogoutText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});