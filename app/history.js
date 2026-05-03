import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Image, ActivityIndicator, TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext'; // ← ADD

export default function HistoryScreen() {
  const router = useRouter();

  // ── DARK MODE ──
  const { theme } = useTheme();
  const { colors, darkMode } = theme;

  const auth = getAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', user.uid),
        orderBy('bookedAt', 'desc')
      );

      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === 'confirmed') return '#3AADBE';
    if (status === 'cancelled') return '#FF6B6B';
    return '#999';
  };

  const renderItem = ({ item }) => (
    // ── DARK MODE: card bg ──
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.hotelImage }} style={styles.cardImage} resizeMode="cover" />

      <View style={styles.cardBody}>

        {/* Name + Status */}
        <View style={styles.cardRow}>
          {/* ── DARK MODE: hotel name ── */}
          <Text style={[styles.hotelName, { color: colors.text }]} numberOfLines={1}>
            {item.hotelName}
          </Text>
          <View style={[styles.statusPill, { backgroundColor: statusColor(item.status) + '22' }]}>
            <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Location */}
        {/* ── DARK MODE: location ── */}
        <Text style={[styles.location, { color: darkMode ? '#5a7a82' : '#999' }]}>
          📍 {item.hotelLocation}
        </Text>

        {/* Divider */}
        {/* ── DARK MODE: divider ── */}
        <View style={[styles.divider, { backgroundColor: darkMode ? '#1e3d47' : '#F0F0F0' }]} />

        {/* Dates */}
        <View style={styles.cardRow}>
          <View style={styles.dateBlock}>
            {/* ── DARK MODE: date labels + values ── */}
            <Text style={[styles.dateLabel, { color: darkMode ? '#5a7a82' : '#aaa' }]}>Check-in</Text>
            <Text style={[styles.dateValue, { color: colors.text }]}>{item.checkInDate}</Text>
          </View>
          <View style={[styles.nightsPill, { backgroundColor: darkMode ? '#0e2d36' : '#EAF9FB' }]}>
            <Text style={styles.nightsText}>{item.nights} Night{item.nights > 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text style={[styles.dateLabel, { textAlign: 'right', color: darkMode ? '#5a7a82' : '#aaa' }]}>
              Check-out
            </Text>
            <Text style={[styles.dateValue, { textAlign: 'right', color: colors.text }]}>
              {item.checkOutDate}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: darkMode ? '#1e3d47' : '#F0F0F0' }]} />

        {/* Total Price */}
        <View style={styles.cardRow}>
          {/* ── DARK MODE: total label ── */}
          <Text style={[styles.totalLabel, { color: darkMode ? '#5a7a82' : '#999' }]}>Total Price</Text>
          <Text style={styles.totalValue}>${item.totalPrice.toLocaleString()}</Text>
        </View>

      </View>
    </View>
  );

  if (loading) {
    return (
      // ── DARK MODE: loading bg ──
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#3AADBE" />
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      // ── DARK MODE: empty state bg ──
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={styles.emptyIcon}>🏨</Text>
        {/* ── DARK MODE: empty state text ── */}
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Bookings Yet</Text>
        <Text style={[styles.emptySubtitle, { color: darkMode ? '#5a7a82' : '#999' }]}>
          Your booking history will appear here.
        </Text>
        <TouchableOpacity style={styles.exploreBtn} onPress={() => router.replace('/')}>
          <Text style={styles.exploreBtnText}>Explore Hotels</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    // ── DARK MODE: container bg ──
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ── DARK MODE: screen title ── */}
      <Text style={[styles.screenTitle, { color: colors.text, backgroundColor: colors.background }]}>
        Booking History
      </Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },                                          // bg set inline
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 }, // bg set inline

  screenTitle: {
    fontSize: 22, fontWeight: '800',
    padding: 20, paddingBottom: 12,                               // color + bg set inline
  },

  list: { padding: 16, paddingTop: 4, gap: 16 },

  // Card — bg set inline
  card: {
    borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.06,
    shadowRadius: 10, elevation: 3,
  },
  cardImage: { width: '100%', height: 160 },
  cardBody:  { padding: 16 },
  cardRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  hotelName:  { fontSize: 16, fontWeight: '700', flex: 1, marginRight: 8 }, // color set inline
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '600' },

  location: { fontSize: 12, marginTop: 4 },                       // color set inline
  divider:  { height: 1, marginVertical: 12 },                    // bg set inline

  dateBlock: { flex: 1 },
  dateLabel: { fontSize: 11, marginBottom: 2 },                   // color set inline
  dateValue: { fontSize: 13, fontWeight: '600' },                 // color set inline

  nightsPill: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginHorizontal: 8 }, // bg set inline
  nightsText: { fontSize: 12, color: '#3AADBE', fontWeight: '600' },

  totalLabel: { fontSize: 13 },                                   // color set inline
  totalValue: { fontSize: 17, fontWeight: '800', color: '#3AADBE' },

  // Empty state
  emptyIcon:     { fontSize: 52, marginBottom: 16 },
  emptyTitle:    { fontSize: 20, fontWeight: '700', marginBottom: 8 },    // color set inline
  emptySubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24 }, // color set inline
  exploreBtn:    { backgroundColor: '#3AADBE', borderRadius: 30, paddingVertical: 14, paddingHorizontal: 32 },
  exploreBtnText:{ color: '#fff', fontWeight: '700', fontSize: 15 },
});