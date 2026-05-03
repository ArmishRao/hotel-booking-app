import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import Svg, { Path, Circle, Line, Polyline, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';

// ─── ICONS ───────────────────────────────────────────────────────────

const IconArrowLeft = ({ size = 22, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const IconSearch = ({ size = 17, color = '#94aab0' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);

const IconChevronDown = ({ size = 16, color = '#94aab0', flipped }) => (
  <Svg
    width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={flipped ? { transform: [{ rotate: '180deg' }] } : {}}
  >
    <Polyline points="6 9 12 15 18 9" />
  </Svg>
);

const IconMail = ({ size = 20, color = '#3aa0b8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Polyline points="22,6 12,13 2,6" />
  </Svg>
);

const IconAlertTriangle = ({ size = 20, color = '#e05c5c' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <Line x1="12" y1="9" x2="12" y2="13" />
    <Line x1="12" y1="17" x2="12.01" y2="17" />
  </Svg>
);

const IconLifeBuoy = ({ size = 44, color = 'rgba(255,255,255,0.92)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="4" />
    <Line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
    <Line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
    <Line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
    <Line x1="14.83" y1="9.17" x2="18.36" y2="5.64" />
    <Line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
  </Svg>
);

const IconHotel = ({ size = 16, color = '#3aa0b8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

const IconX = ({ size = 16, color = '#7c6fcd' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

const IconLock = ({ size = 16, color = '#d97706' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const IconCreditCard = ({ size = 16, color = '#e05c8a' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <Line x1="1" y1="10" x2="23" y2="10" />
  </Svg>
);

// ─── FAQ DATA ─────────────────────────────────────────────────────────
const FAQS = [
  {
    icon: IconHotel,  iconBg: '#e4f5f9', iconColor: '#3aa0b8',
    q: 'How do I book a hotel?',
    a: 'Go to the home screen, browse or search for a hotel, select your dates and tap Book Now to confirm your reservation.',
  },
  {
    icon: IconX,      iconBg: '#eeebfd', iconColor: '#7c6fcd',
    q: 'How do I cancel a booking?',
    a: 'Navigate to History in your profile, find the booking you want to cancel, and tap the Cancel option.',
  },
  {
    icon: IconLock,   iconBg: '#fef3e2', iconColor: '#d97706',
    q: 'How do I change my password?',
    a: 'Go to Settings and tap Change Password. Enter your new password and confirm to save the update.',
  },
  {
    icon: IconCreditCard, iconBg: '#fdedf3', iconColor: '#e05c8a',
    q: 'My payment failed. What should I do?',
    a: 'Check your card details and try again. If the issue persists, try a different payment method or contact your bank.',
  },
];

// ─── FAQ CARD ─────────────────────────────────────────────────────────
const FaqCard = ({ item, isLast }) => {
  const [open, setOpen] = useState(false);
  const ItemIcon = item.icon;

  return (
    <TouchableOpacity
      style={[s.faqCard, !isLast && s.faqCardBorder]}
      onPress={() => setOpen((v) => !v)}
      activeOpacity={0.75}
    >
      <View style={s.faqHeader}>
        <View style={[s.faqIconWrap, { backgroundColor: item.iconBg }]}>
          <ItemIcon size={15} color={item.iconColor} />
        </View>
        <Text style={s.faqQuestion}>{item.q}</Text>
        <IconChevronDown size={16} color="#b0c4ca" flipped={open} />
      </View>

      {open && (
        <View style={s.faqBody}>
          <View style={s.faqDivider} />
          <Text style={s.faqAnswer}>{item.a}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────
export default function SupportScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = FAQS.filter((item) =>
    item.q.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#3aa0b8" />

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

        <View style={s.heroIconWrap}>
          <IconLifeBuoy size={44} />
        </View>

        <Text style={s.heroTitle}>Help & Support</Text>
        <Text style={s.heroSub}>Find answers or get in touch with our team</Text>

        {/* Search bar inside hero */}
        <View style={s.searchWrap}>
          <View style={s.searchIcon}>
            <IconSearch size={17} color="#94aab0" />
          </View>
          <TextInput
            style={s.searchInput}
            placeholder="Search help topics..."
            placeholderTextColor="#b0c4ca"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.body}>

          {/* ── FAQs ── */}
          <Text style={s.sectionLabel}>Frequently Asked</Text>

          <View style={s.faqCard_outer}>
            {filtered.length > 0 ? (
              filtered.map((item, i) => (
                <FaqCard key={i} item={item} isLast={i === filtered.length - 1} />
              ))
            ) : (
              <View style={s.emptyWrap}>
                <Text style={s.emptyText}>No results for "{search}"</Text>
              </View>
            )}
          </View>

          {/* ── CONTACT ── */}
          <Text style={s.sectionLabel}>Get in Touch</Text>

          <View style={s.contactCard}>
            {/* Email support */}
            <TouchableOpacity
              style={[s.contactRow, s.contactRowBorder]}
              onPress={() => Linking.openURL('mailto:support@hotelapp.com')}
              activeOpacity={0.7}
            >
              <View style={[s.contactIconWrap, { backgroundColor: '#e4f5f9' }]}>
                <IconMail size={20} color="#3aa0b8" />
              </View>
              <View style={s.contactTextWrap}>
                <Text style={s.contactTitle}>Email Support</Text>
                <Text style={s.contactSub}>support@hotelapp.com</Text>
              </View>
              <IconChevronDown size={16} color="#b8cdd2"
                style={{ transform: [{ rotate: '-90deg' }] }} />
            </TouchableOpacity>

            {/* Report issue */}
            <TouchableOpacity
              style={s.contactRow}
              onPress={() => Alert.alert('Coming Soon', 'Report feature will be available in the next update.')}
              activeOpacity={0.7}
            >
              <View style={[s.contactIconWrap, { backgroundColor: '#fee2e2' }]}>
                <IconAlertTriangle size={20} color="#e05c5c" />
              </View>
              <View style={s.contactTextWrap}>
                <Text style={s.contactTitle}>Report an Issue</Text>
                <Text style={s.contactSub}>Let us know what went wrong</Text>
              </View>
              <IconChevronDown size={16} color="#b8cdd2"
                style={{ transform: [{ rotate: '-90deg' }] }} />
            </TouchableOpacity>
          </View>

          {/* Response time note */}
          <View style={s.noteCard}>
            <View style={s.noteLine} />
            <Text style={s.noteText}>
              Our support team typically responds within 24 hours on business days.
            </Text>
          </View>

        </View>
      </ScrollView>
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
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 36,
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
    bottom: 20, left: -40,
  },
  backBtn: {
    alignSelf: 'flex-start',
    width: 38, height: 38,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 11,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
  },
  heroIconWrap: {
    width: 78, height: 78,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14,
  },
  heroTitle: { fontSize: 22, fontWeight: '700', color: '#fff', letterSpacing: 0.2, marginBottom: 6 },
  heroSub:   { fontSize: 13, color: 'rgba(255,255,255,0.68)', textAlign: 'center', marginBottom: 20 },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  searchIcon:  { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14.5, color: '#1a3a42' },

  // Body
  body: {
    backgroundColor: BG,
    marginTop: -18,
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
    marginBottom: 10,
    marginTop: 4,
  },

  // FAQ outer card
  faqCard_outer: {
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
  faqCard: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
  },
  faqCardBorder: {
    borderBottomWidth: 0.6,
    borderBottomColor: '#edf1f2',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  faqIconWrap: {
    width: 32, height: 32,
    borderRadius: 9,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  faqQuestion: {
    flex: 1, fontSize: 14, fontWeight: '600',
    color: '#1a3a42', letterSpacing: 0.1,
  },
  faqDivider: {
    height: 1, backgroundColor: '#edf1f2', marginVertical: 10,
  },
  faqBody: {},
  faqAnswer: {
    fontSize: 13.5, color: '#4a6870',
    lineHeight: 20, fontWeight: '400',
  },

  // Empty state
  emptyWrap: { padding: 24, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#94aab0', fontWeight: '500' },

  // Contact card
  contactCard: {
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
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    gap: 13,
  },
  contactRowBorder: {
    borderBottomWidth: 0.6,
    borderBottomColor: '#edf1f2',
  },
  contactIconWrap: {
    width: 44, height: 44,
    borderRadius: 13,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  contactTextWrap: { flex: 1 },
  contactTitle: { fontSize: 14.5, fontWeight: '600', color: '#1a3a42', marginBottom: 2 },
  contactSub:   { fontSize: 12.5, color: '#7fa0a8', fontWeight: '400' },

  // Note card
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    marginBottom: 8,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  noteLine: {
    width: 3, borderRadius: 2,
    backgroundColor: PRIMARY,
  },
  noteText: {
    flex: 1, fontSize: 13, color: '#4a7a85',
    lineHeight: 19, fontWeight: '400',
  },
});