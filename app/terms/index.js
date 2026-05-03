import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext'; // ← ADD

// ─── ICONS (unchanged) ────────────────────────────────────────────────

const IconArrowLeft = ({ size = 22, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const IconFile = ({ size = 46, color = 'rgba(255,255,255,0.92)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Line x1="16" y1="13" x2="8" y2="13" />
    <Line x1="16" y1="17" x2="8" y2="17" />
    <Polyline points="10 9 9 9 8 9" />
  </Svg>
);

const IconMonitor = ({ size = 18, color = '#3aa0b8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <Line x1="8" y1="21" x2="16" y2="21" />
    <Line x1="12" y1="17" x2="12" y2="21" />
  </Svg>
);

const IconCalendar = ({ size = 18, color = '#7c6fcd' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

const IconCreditCard = ({ size = 18, color = '#e05c8a' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <Line x1="1" y1="10" x2="23" y2="10" />
  </Svg>
);

const IconUser = ({ size = 18, color = '#d97706' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const IconRefreshCw = ({ size = 18, color = '#3aa0b8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="23 4 23 10 17 10" />
    <Polyline points="1 20 1 14 7 14" />
    <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </Svg>
);

// ─── TERMS DATA (unchanged) ───────────────────────────────────────────
const TERMS = [
  {
    number: '01', title: 'Use of App', Icon: IconMonitor, iconBg: '#e4f5f9',
    content: 'You must use this app only for lawful purposes and in a way that does not harm the app or other users. Any misuse may result in account suspension.',
  },
  {
    number: '02', title: 'Bookings', Icon: IconCalendar, iconBg: '#eeebfd',
    content: 'All hotel bookings are subject to availability and confirmation. We reserve the right to cancel bookings if necessary and will notify you promptly.',
  },
  {
    number: '03', title: 'Payments', Icon: IconCreditCard, iconBg: '#fdedf3',
    content: 'Payments must be completed through approved payment methods. We are not responsible for external payment failures or third-party processing issues.',
  },
  {
    number: '04', title: 'User Data', Icon: IconUser, iconBg: '#fef3e2',
    content: 'We store your basic information such as name, email, and profile image to provide a better experience. Your data is never sold to third parties.',
  },
  {
    number: '05', title: 'Changes to Terms', Icon: IconRefreshCw, iconBg: '#e4f5f9',
    content: 'We may update these terms at any time. Continued use of the app following any changes means you accept the updated terms and conditions.',
  },
];

// ─── TERM CARD ────────────────────────────────────────────────────────
const TermCard = ({ item, colors, darkMode }) => {
  const [expanded, setExpanded] = useState(true);
  const ItemIcon = item.Icon;

  return (
    <TouchableOpacity
      style={[s.termCard, { backgroundColor: colors.card }]}
      onPress={() => setExpanded((v) => !v)}
      activeOpacity={0.85}
    >
      <View style={s.termHeader}>
        <View style={[s.termIconWrap, { backgroundColor: item.iconBg }]}>
          <ItemIcon size={18} />
        </View>

        <View style={s.termTitleWrap}>
          {/* ── DARK MODE: term number ── */}
          <Text style={[s.termNumber, { color: darkMode ? '#5a7a82' : '#b0c4ca' }]}>
            {item.number}
          </Text>
          {/* ── DARK MODE: term title ── */}
          <Text style={[s.termTitle, { color: colors.text }]}>{item.title}</Text>
        </View>

        {/* ── DARK MODE: chevron bg ── */}
        <View style={[s.chevronWrap, { backgroundColor: darkMode ? '#1e3d47' : '#f0f4f5' }, expanded && s.chevronWrapOpen]}>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none"
            stroke="#94aab0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Polyline points="6 9 12 15 18 9" />
          </Svg>
        </View>
      </View>

      {expanded && (
        <View style={s.termBody}>
          {/* ── DARK MODE: divider ── */}
          <View style={[s.termDivider, { backgroundColor: darkMode ? '#1e3d47' : '#edf1f2' }]} />
          {/* ── DARK MODE: term text ── */}
          <Text style={[s.termText, { color: darkMode ? '#5a8a95' : '#4a6870' }]}>
            {item.content}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────
export default function TermsScreen() {
  const router = useRouter();

  // ── DARK MODE ──
  const { theme } = useTheme();
  const { colors, darkMode } = theme;

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: PRIMARY }]}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />

      {/* ── HERO — always brand-colored, unchanged ── */}
      <View style={s.hero}>
        <View style={s.heroCircle1} />
        <View style={s.heroCircle2} />

        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
          <IconArrowLeft size={22} color="#fff" />
        </TouchableOpacity>

        <View style={s.fileWrap}>
          <IconFile size={46} />
        </View>

        <Text style={s.heroTitle}>Terms & Conditions</Text>
        <Text style={s.heroSub}>Please read these terms carefully before using our service</Text>
      </View>

      {/* ── DARK MODE: scroll bg ── */}
      <ScrollView
        style={[s.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── DARK MODE: body bg ── */}
        <View style={[s.body, { backgroundColor: colors.background }]}>

          {/* Intro card */}
          {/* ── DARK MODE: intro card bg ── */}
          <View style={[s.introCard, { backgroundColor: colors.card }]}>
            <View style={s.introLine} />
            {/* ── DARK MODE: intro text ── */}
            <Text style={[s.introText, { color: darkMode ? '#5a8a95' : '#4a7a85' }]}>
              By using the Hotel Booking App, you agree to be bound by the following terms and conditions. These govern your use of our platform and services.
            </Text>
          </View>

          {/* Term cards */}
          {TERMS.map((item) => (
            <TermCard key={item.number} item={item} colors={colors} darkMode={darkMode} />
          ))}

          {/* Footer */}
          <View style={s.footer}>
            <View style={[s.footerDot, { backgroundColor: darkMode ? '#1e3d47' : '#c0d0d4' }]} />
            {/* ── DARK MODE: footer text ── */}
            <Text style={[s.footerText, { color: darkMode ? '#5a7a82' : '#94aab0' }]}>
              Last updated: January 2026
            </Text>
            <View style={[s.footerDot, { backgroundColor: darkMode ? '#1e3d47' : '#c0d0d4' }]} />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────
const PRIMARY = '#3aa0b8';

const s = StyleSheet.create({

  safe: { flex: 1 },  // ← bg set inline from PRIMARY

  // Hero — always brand-colored, unchanged
  hero: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 0,
    paddingBottom: 12,
    alignItems: 'center',
  },
  heroCircle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -60, right: -50,
  },
  heroCircle2: {
    position: 'absolute', width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: 20, left: -40,
  },
  backBtn: {
    alignSelf: 'flex-start', width: 38, height: 38,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 11,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 22,
  },
  fileWrap: {
    width: 80, height: 80,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: { fontSize: 22, fontWeight: '700', color: '#fff', letterSpacing: 0.2, marginBottom: 8 },
  heroSub:   { fontSize: 13, color: 'rgba(255,255,255,0.68)', textAlign: 'center', lineHeight: 19, paddingHorizontal: 10 },

  // Scroll — bg set inline
  scroll:        {},
  scrollContent: { paddingBottom: 40 },

  // Body — bg set inline
  body: {
    marginTop: -22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 26,
    paddingHorizontal: 16,
  },

  // Intro card — bg set inline
  introCard: {
    flexDirection: 'row',
    borderRadius: 14, padding: 16, marginBottom: 16, gap: 12,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  introLine: { width: 3, borderRadius: 2, backgroundColor: PRIMARY },
  introText: { flex: 1, fontSize: 13.5, lineHeight: 20, fontWeight: '400' }, // color set inline

  // Term card — bg set inline
  termCard: {
    borderRadius: 16, marginBottom: 10,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  termHeader:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  termIconWrap:  { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  termTitleWrap: { flex: 1 },
  termNumber:    { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 1 }, // color set inline
  termTitle:     { fontSize: 15, fontWeight: '600' },  // color set inline
  chevronWrap:   { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }, // bg set inline
  chevronWrapOpen: { transform: [{ rotate: '180deg' }] },
  termDivider:   { height: 1, marginVertical: 12 },    // bg set inline
  termBody:      {},
  termText:      { fontSize: 13.5, lineHeight: 21, fontWeight: '400' }, // color set inline

  // Footer
  footer:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20, marginBottom: 4 },
  footerDot: { width: 4, height: 4, borderRadius: 2 }, // bg set inline
  footerText: { fontSize: 12, fontWeight: '500' },      // color set inline
});