import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Image, ActivityIndicator, TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function HistoryScreen() {
  const router = useRouter();
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
        orderBy('bookedAt', 'desc')   // newest first
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
    <View style={styles.card}>
      {/* Hotel Image */}
      <Image source={{ uri: item.hotelImage }} style={styles.cardImage} resizeMode="cover" />

      {/* Card Body */}
      <View style={styles.cardBody}>

        {/* Name + Status */}
        <View style={styles.cardRow}>
          <Text style={styles.hotelName} numberOfLines={1}>{item.hotelName}</Text>
          <View style={[styles.statusPill, { backgroundColor: statusColor(item.status) + '22' }]}>
            <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Location */}
        <Text style={styles.location}>📍 {item.hotelLocation}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Dates */}
        <View style={styles.cardRow}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Check-in</Text>
            <Text style={styles.dateValue}>{item.checkInDate}</Text>
          </View>
          <View style={styles.nightsPill}>
            <Text style={styles.nightsText}>{item.nights} Night{item.nights > 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text style={[styles.dateLabel, { textAlign: 'right' }]}>Check-out</Text>
            <Text style={[styles.dateValue, { textAlign: 'right' }]}>{item.checkOutDate}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Total Price */}
        <View style={styles.cardRow}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalValue}>${item.totalPrice.toLocaleString()}</Text>
        </View>

      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3AADBE" />
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyIcon}>🏨</Text>
        <Text style={styles.emptyTitle}>No Bookings Yet</Text>
        <Text style={styles.emptySubtitle}>Your booking history will appear here.</Text>
        <TouchableOpacity style={styles.exploreBtn} onPress={() => router.replace('/')}>
          <Text style={styles.exploreBtnText}>Explore Hotels</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Booking History</Text>
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
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },

  screenTitle: {
    fontSize: 22, fontWeight: '800', color: '#111',
    padding: 20, paddingBottom: 12, backgroundColor: '#F5F5F5',
  },

  list: { padding: 16, paddingTop: 4, gap: 16 },

  // Card
  card: {
    backgroundColor: '#fff', borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.06,
    shadowRadius: 10, elevation: 3,
  },
  cardImage: { width: '100%', height: 160 },
  cardBody: { padding: 16 },

  cardRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
  },

  hotelName: {
    fontSize: 16, fontWeight: '700', color: '#111', flex: 1, marginRight: 8,
  },

  statusPill: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  statusText: { fontSize: 12, fontWeight: '600' },

  location: { color: '#999', fontSize: 12, marginTop: 4 },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },

  dateBlock: { flex: 1 },
  dateLabel: { fontSize: 11, color: '#aaa', marginBottom: 2 },
  dateValue: { fontSize: 13, fontWeight: '600', color: '#111' },

  nightsPill: {
    backgroundColor: '#EAF9FB', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6, marginHorizontal: 8,
  },
  nightsText: { fontSize: 12, color: '#3AADBE', fontWeight: '600' },

  totalLabel: { fontSize: 13, color: '#999' },
  totalValue: { fontSize: 17, fontWeight: '800', color: '#3AADBE' },

  // Empty state
  emptyIcon: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#111', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 24 },
  exploreBtn: {
    backgroundColor: '#3AADBE', borderRadius: 30,
    paddingVertical: 14, paddingHorizontal: 32,
  },
  exploreBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});