
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

export default function HotelDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotel();
  }, [id]);

  const fetchHotel = async () => {
    try {
      const docRef = doc(db, 'hotels', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHotel({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3AADBE" />
      </View>
    );
  }

  if (!hotel) {
    return (
      <View style={styles.centered}>
        <Text>Hotel not found.</Text>
      </View>
    );
  }

  // Use facilities from Firestore, fallback to defaults if not added yet
  const facilities = hotel.facilities?.length > 0
    ? hotel.facilities
    : [
        { icon: '🛏', label: '2 Bed' },
        { icon: '🛁', label: '2 Bath' },
        { icon: '🎮', label: 'PS 5' },
        { icon: '📶', label: 'Free WiFi' },
      ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HERO IMAGE */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: hotel.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />

          {/* Top buttons */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
              <Text style={styles.iconBtnText}>←</Text>
            </TouchableOpacity>
            <View style={styles.topRight}>
              <TouchableOpacity style={styles.iconBtn}>
                <Text style={styles.iconBtnText}>♡</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconBtn, { marginLeft: 10 }]}>
                <Text style={styles.iconBtnText}>⋮</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hotel info overlay */}
          <View style={styles.imageInfo}>
            <Text style={styles.imageName}>{hotel.name}</Text>
            <View style={styles.imageRow}>
              <Text style={styles.imageLocation}>📍 {hotel.location}</Text>
              <View style={styles.ratingPill}>
                <Text style={styles.ratingText}>⭐ {hotel.rating || 4.9} Star</Text>
              </View>
              <Text style={styles.imagePrice}>${hotel.price}/Night</Text>
            </View>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>

          {/* FACILITIES — dynamic from Firestore */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Facilities</Text>
            <Text style={styles.seeAll}>See All</Text>
          </View>

          <View style={styles.facilitiesGrid}>
            {facilities.map((facility, index) => (
              <View key={index} style={styles.facilityCard}>
                <Text style={styles.facilityIcon}>{facility.icon}</Text>
                <Text style={styles.facilityText}>{facility.label}</Text>
              </View>
            ))}
          </View>

          {/* OWNER */}
          <View style={styles.ownerCard}>
            <View style={styles.ownerLeft}>
              <View style={styles.ownerAvatar}>
                <Text style={{ color: '#aaa', fontSize: 22 }}>👤</Text>
              </View>
              <View>
                <Text style={styles.ownerLabel}>Owner</Text>
                <Text style={styles.ownerName}>
                  {hotel.owner || 'Gilbert Alex'}
                </Text>
              </View>
            </View>
            <View style={styles.ownerActions}>
              <TouchableOpacity style={styles.ownerBtn}>
                <Text style={styles.ownerBtnIcon}>📞</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.ownerBtn, { marginLeft: 10 }]}>
                <Text style={styles.ownerBtnIcon}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* DESCRIPTION */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {hotel.description ||
              "A modern hotel that combines sleek design, cutting-edge amenities, and warm hospitality. Offering elegant rooms, world-class dining, and premium facilities such as a spa, rooftop pool, and fully equipped fitness center, it's the perfect destination for comfort and style."}
          </Text>

        </View>
      </ScrollView>

      {/* BOOKING BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookingBtn}>
          <Text style={styles.bookingText}>Booking</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  imageContainer: { height: 280, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },

  topBar: {
    position: 'absolute', top: 52, left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  topRight: { flexDirection: 'row' },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  iconBtnText: { fontSize: 16, color: '#222' },

  imageInfo: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  imageName: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 6 },
  imageRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  imageLocation: { color: '#ddd', fontSize: 12, flex: 1 },
  ratingPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },
  ratingText: { color: '#fff', fontSize: 11 },
  imagePrice: { color: '#fff', fontWeight: '700', fontSize: 13 },

  content: { padding: 20, paddingBottom: 100 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14, marginTop: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 12 },
  seeAll: { color: '#3AADBE', fontSize: 13 },

  /* FACILITIES — wraps to next row automatically */
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  facilityCard: {
    width: (width - 60) / 4,
    backgroundColor: '#F7F7F7',
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 14,
  },
  facilityIcon: { fontSize: 22, marginBottom: 6 },
  facilityText: { fontSize: 11, color: '#555', fontWeight: '500', textAlign: 'center' },

  ownerCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#F7F7F7', borderRadius: 16, padding: 14, marginBottom: 20,
  },
  ownerLeft: { flexDirection: 'row', alignItems: 'center' },
  ownerAvatar: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: '#E0E0E0',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  ownerLabel: { fontSize: 11, color: '#999' },
  ownerName: { fontSize: 15, fontWeight: '700', color: '#111' },
  ownerActions: { flexDirection: 'row' },
  ownerBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#E8F8FA', alignItems: 'center', justifyContent: 'center',
  },
  ownerBtnIcon: { fontSize: 16 },

  description: { fontSize: 14, color: '#666', lineHeight: 22 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
  },
  bookingBtn: {
    backgroundColor: '#3AADBE', borderRadius: 30,
    paddingVertical: 16, alignItems: 'center',
  },
  bookingText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
