import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';
import { auth, db } from '../../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

// ─── SVG ICONS (unchanged) ───────────────────────────────────────────

const IconUser = ({ size = 20, color = '#3aa0b8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const IconLock = ({ size = 20, color = '#3aa0b8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const IconBell = ({ size = 20, color = '#d97706' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const IconHeart = ({ size = 20, color = '#e05c8a' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

const IconClock = ({ size = 20, color = '#3aa0b8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

const IconSettings = ({ size = 20, color = '#7c6fcd' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

const IconHelp = ({ size = 20, color = '#3aa0b8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <Line x1="12" y1="17" x2="12.01" y2="17" />
  </Svg>
);

const IconFile = ({ size = 20, color = '#7c6fcd' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Line x1="16" y1="13" x2="8" y2="13" />
    <Line x1="16" y1="17" x2="8" y2="17" />
  </Svg>
);

const IconLogOut = ({ size = 20, color = '#dc4a4a' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
);

const IconEdit = ({ size = 16, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Svg>
);

const IconChevron = ({ size = 18, color = '#b0c4ca' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
);

// ─── MENU CONFIG ─────────────────────────────────────────────────────
// iconBg is now a function so it can return dark/light color dynamically
const getMenuSections = (colors) => [
  {
    label: 'Account',
    items: [
      { title: 'My Account',      route: '/account',                 Icon: IconUser,     iconBg: colors.iconBgBlue,   badge: null },
      { title: 'Update Password', route: '/account/update-password', Icon: IconLock,     iconBg: colors.iconBgBlue,   badge: null },
      { title: 'Notifications',   route: '/notification',            Icon: IconBell,     iconBg: colors.iconBgAmber,  badge: '3'  },
    ],
  },
  {
    label: 'Activity',
    items: [
      { title: 'Favorites', route: '/favorite', Icon: IconHeart,    iconBg: colors.iconBgPink,   badge: null },
      { title: 'History',   route: '/history',  Icon: IconClock,    iconBg: colors.iconBgBlue,   badge: null },
      { title: 'Settings',  route: '/settings', Icon: IconSettings, iconBg: colors.iconBgPurple, badge: null },
    ],
  },
  {
    label: 'Support',
    items: [
      { title: 'Help & Support',     route: '/support', Icon: IconHelp, iconBg: colors.iconBgBlue,   badge: null },
      { title: 'Terms & Conditions', route: '/terms',   Icon: IconFile, iconBg: colors.iconBgPurple, badge: null },
    ],
  },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────
export default function ProfileScreen() {
  const [userData, setUserData]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [logoutModal, setLogoutModal] = useState(false);

  // ── DARK MODE ──
  const { theme } = useTheme();
  const { colors, darkMode } = theme;

  const router = useRouter();

  const fetchUserData = async (user) => {
    try {
      if (!user) return;
      const docRef  = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setUserData(docSnap.data());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(fetchUserData);
    return unsub;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setLogoutModal(false);
    router.replace('/auth/login');
  };

  const getInitials = (name = '') =>
    name.trim().split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'U';

  // ── DARK MODE: loader bg ──
  if (loading) {
    return (
      <View style={[s.loaderWrap, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#3aa0b8" />
      </View>
    );
  }

  // Build menu with dynamic icon backgrounds
  const MENU_SECTIONS = getMenuSections(colors);

  return (
    // ── DARK MODE: safe area bg ──
    <SafeAreaView style={[s.safe, { backgroundColor: colors.hero }]}>

      {/* ── DARK MODE: status bar ── */}
      <StatusBar barStyle="light-content" backgroundColor={colors.hero} />

      {/* ── DARK MODE: scroll bg ── */}
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HERO ── DARK MODE: hero bg ── */}
        <View style={[s.hero, { backgroundColor: colors.hero }]}>
          <View style={s.heroCircle1} />
          <View style={s.heroCircle2} />

          <View style={s.topBar}>
            <Text style={s.screenTitle}>Profile</Text>
            <TouchableOpacity
              style={s.editBtn}
              onPress={() => router.push('/account')}
              activeOpacity={0.75}
            >
              <IconEdit size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={s.avatarSection}>
            <View style={s.avatarWrap}>
              {userData?.image ? (
                <Image source={{ uri: userData.image }} style={s.avatarImg} />
              ) : (
                <View style={s.avatarFallback}>
                  <Text style={s.avatarInitials}>{getInitials(userData?.name)}</Text>
                </View>
              )}
              <View style={s.onlineDot} />
            </View>

            <Text style={s.userName}>{userData?.name || 'User'}</Text>
            <Text style={s.userEmail}>{userData?.email || ''}</Text>
          </View>
        </View>

        {/* ── BODY ── DARK MODE: body bg ── */}
        <View style={[s.body, { backgroundColor: colors.background }]}>

          {MENU_SECTIONS.map((section) => (
            <View key={section.label}>

              {/* ── DARK MODE: section label color ── */}
              <Text style={[s.sectionLabel, { color: colors.sectionLabel }]}>
                {section.label}
              </Text>

              {/* ── DARK MODE: card bg ── */}
              <View style={[s.menuCard, { backgroundColor: colors.card }]}>
                {section.items.map((item, idx) => {
                  const ItemIcon = item.Icon;
                  return (
                    <TouchableOpacity
                      key={item.route}
                      style={[
                        s.menuItem,
                        idx < section.items.length - 1 && s.menuItemBorder,
                      ]}
                      onPress={() => router.push(item.route)}
                      activeOpacity={0.7}
                    >
                      {/* ── DARK MODE: icon bg from colors ── */}
                      <View style={[s.menuIcon, { backgroundColor: item.iconBg }]}>
                        <ItemIcon size={18} />
                      </View>

                      {/* ── DARK MODE: menu label text ── */}
                      <Text style={[s.menuLabel, { color: colors.text }]}>
                        {item.title}
                      </Text>

                      {item.badge && (
                        <View style={s.notifBadge}>
                          <Text style={s.notifBadgeText}>{item.badge}</Text>
                        </View>
                      )}

                      <IconChevron size={18} color="#b8cdd2" />
                    </TouchableOpacity>
                  );
                })}
              </View>

            </View>
          ))}

          {/* ── LOGOUT ── */}
          {/* ── DARK MODE: section label + card ── */}
          <Text style={[s.sectionLabel, { color: colors.sectionLabel }]}>Session</Text>
          <View style={[s.menuCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={s.menuItem}
              onPress={() => setLogoutModal(true)}
              activeOpacity={0.7}
            >
              <View style={[s.menuIcon, { backgroundColor: '#fee2e2' }]}>
                <IconLogOut size={18} color="#dc4a4a" />
              </View>
              <Text style={[s.menuLabel, { color: '#dc4a4a' }]}>Log Out</Text>
              <IconChevron size={18} color="#f8a0a0" />
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* ── LOGOUT MODAL ── DARK MODE: box bg + title ── */}
      <Modal
        transparent
        visible={logoutModal}
        animationType="fade"
        onRequestClose={() => setLogoutModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={[s.modalBox, { backgroundColor: colors.card }]}>

            <View style={s.modalIconWrap}>
              <IconLogOut size={26} color="#dc4a4a" />
            </View>

            <Text style={[s.modalTitle, { color: colors.text }]}>Log out?</Text>
            <Text style={s.modalSub}>
              You'll be signed out and returned to the login screen.
            </Text>

            <View style={s.modalActions}>
              <TouchableOpacity
                style={[s.btnCancel, { backgroundColor: colors.background }]}
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
// Static only — all dynamic colors applied inline above
const PRIMARY = '#3aa0b8';

const s = StyleSheet.create({

  safe:          { flex: 1 },
  scrollContent: { paddingBottom: 48 },
  loaderWrap:    { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Hero
  hero: {
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 52,
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -50, right: -50,
  },
  heroCircle2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: 10, left: -30,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  screenTitle: { fontSize: 19, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },
  editBtn: {
    width: 36, height: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },

  // Avatar
  avatarSection: { alignItems: 'center' },
  avatarWrap:    { position: 'relative', width: 82, height: 82, marginBottom: 14 },
  avatarImg: {
    width: 82, height: 82, borderRadius: 24,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.45)',
  },
  avatarFallback: {
    width: 82, height: 82, borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.45)',
  },
  avatarInitials: { fontSize: 28, fontWeight: '800', color: PRIMARY },
  onlineDot: {
    position: 'absolute', bottom: 4, right: 4,
    width: 13, height: 13, borderRadius: 7,
    backgroundColor: '#4ade80',
    borderWidth: 2, borderColor: '#2a8aa0',
  },
  userName:  { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4, letterSpacing: 0.2 },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 18 },

  // Body
  body: {
    marginTop: -22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
    marginBottom: 8,
    marginTop: 4,
  },

  // Menu
  menuCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
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
    letterSpacing: 0.1,
  },
  notifBadge: {
    backgroundColor: PRIMARY,
    borderRadius: 20,
    paddingHorizontal: 9, paddingVertical: 3,
    marginRight: 4,
  },
  notifBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10,30,35,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
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
  modalTitle:    { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  modalSub:      { fontSize: 13.5, color: '#7fa0a8', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  modalActions:  { flexDirection: 'row', gap: 10, width: '100%' },
  btnCancel:     { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
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