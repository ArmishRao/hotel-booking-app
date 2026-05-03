import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';
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
import { useTheme } from '../context/ThemeContext'; // ← ADD

const { width } = Dimensions.get('window');

export default function HotelDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // ── DARK MODE ──
  const { theme } = useTheme();
  const { colors, darkMode } = theme;

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

  const handleCall = () => {
    const phone = hotel.contact;
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = () => {
    const phone = hotel.contact?.replace(/\D/g, '');
    if (phone) Linking.openURL(`https://wa.me/${phone}`);
  };

  if (loading) {
    return (
      // ── DARK MODE: loading bg ──
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#3AADBE" />
      </View>
    );
  }

  if (!hotel) {
    return (
      // ── DARK MODE: not found bg ──
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Hotel not found.</Text>
      </View>
    );
  }

  const facilities = hotel.facilities?.length > 0
    ? hotel.facilities
    : [
        { icon: '🛏', label: '2 Bed' },
        { icon: '🛁', label: '2 Bath' },
        { icon: '🎮', label: 'PS 5' },
        { icon: '📶', label: 'Free WiFi' },
      ];

  return (
    // ── DARK MODE: container bg ──
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HERO IMAGE — overlay text always white, unchanged */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: hotel.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.imageOverlay} />

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

          {/* FACILITIES */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Facilities</Text>
            <Text style={styles.seeAll}>See All</Text>
          </View>

          <View style={styles.facilitiesGrid}>
            {facilities.map((facility, index) => (
              // ── DARK MODE: facility card bg ──
              <View key={index} style={[styles.facilityCard, { backgroundColor: darkMode ? colors.card : '#F7F7F7' }]}>
                <Text style={styles.facilityIcon}>{facility.icon}</Text>
                {/* ── DARK MODE: facility text ── */}
                <Text style={[styles.facilityText, { color: darkMode ? '#5a8a95' : '#555' }]}>
                  {facility.label}
                </Text>
              </View>
            ))}
          </View>

          {/* OWNER */}
          {/* ── DARK MODE: owner card bg ── */}
          <View style={[styles.ownerCard, { backgroundColor: darkMode ? colors.card : '#F7F7F7' }]}>
            <View style={styles.ownerLeft}>
              {/* ── DARK MODE: avatar bg ── */}
              <View style={[styles.ownerAvatar, { backgroundColor: darkMode ? '#1e3d47' : '#E0E0E0' }]}>
                <Text style={{ color: '#aaa', fontSize: 22 }}>👤</Text>
              </View>
              <View>
                {/* ── DARK MODE: owner label + name ── */}
                <Text style={[styles.ownerLabel, { color: darkMode ? '#5a7a82' : '#999' }]}>Owner</Text>
                <Text style={[styles.ownerName, { color: colors.text }]}>
                  {hotel.owner || 'Gilbert Alex'}
                </Text>
              </View>
            </View>
            <View style={styles.ownerActions}>
              <TouchableOpacity
                style={[styles.ownerBtn, { backgroundColor: darkMode ? '#0e2d36' : '#E8F8FA' }]}
                onPress={handleCall}
              >
                <Text style={styles.ownerBtnIcon}>📞</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ownerBtn, { marginLeft: 10, backgroundColor: darkMode ? '#0e2d36' : '#E8F8FA' }]}
                onPress={handleWhatsApp}
              >
                <Text style={styles.ownerBtnIcon}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* DESCRIPTION */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          {/* ── DARK MODE: description text ── */}
          <Text style={[styles.description, { color: darkMode ? '#5a8a95' : '#666' }]}>
            {hotel.description ||
              "A modern hotel that combines sleek design, cutting-edge amenities, and warm hospitality. Offering elegant rooms, world-class dining, and premium facilities such as a spa, rooftop pool, and fully equipped fitness center, it's the perfect destination for comfort and style."}
          </Text>

        </View>
      </ScrollView>

      {/* Booking button — brand color, unchanged */}
      <TouchableOpacity
        style={styles.bookingBtn}
        onPress={() => router.push({ pathname: '/booking', params: { id: hotel.id } })}
      >
        <Text style={styles.bookingText}>Booking</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },                                         // bg set inline
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center' }, // bg set inline

  imageContainer: { height: 280, position: 'relative' },
  heroImage:      { width: '100%', height: '100%' },
  imageOverlay:   { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.38)' },

  // Top bar — always white buttons on image, unchanged
  topBar:      { position: 'absolute', top: 52, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topRight:    { flexDirection: 'row' },
  iconBtn:     { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  iconBtnText: { fontSize: 16, color: '#222' },

  // Image overlay text — always white, unchanged
  imageInfo:     { position: 'absolute', bottom: 16, left: 16, right: 16 },
  imageName:     { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 6 },
  imageRow:      { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  imageLocation: { color: '#ddd', fontSize: 12, flex: 1 },
  ratingPill:    { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  ratingText:    { color: '#fff', fontSize: 11 },
  imagePrice:    { color: '#fff', fontWeight: '700', fontSize: 13 },

  content: { padding: 20, paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, marginTop: 4 },
  sectionTitle:  { fontSize: 18, fontWeight: '700', marginBottom: 12 }, // color set inline
  seeAll:        { color: '#3AADBE', fontSize: 13 },

  // Facilities — bg set inline
  facilitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  facilityCard:   { width: (width - 60) / 4, borderRadius: 14, alignItems: 'center', paddingVertical: 14 }, // bg set inline
  facilityIcon:   { fontSize: 22, marginBottom: 6 },
  facilityText:   { fontSize: 11, fontWeight: '500', textAlign: 'center' }, // color set inline

  // Owner card — bg set inline
  ownerCard:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 16, padding: 14, marginBottom: 20 }, // bg set inline
  ownerLeft:    { flexDirection: 'row', alignItems: 'center' },
  ownerAvatar:  { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginRight: 12 }, // bg set inline
  ownerLabel:   { fontSize: 11 },         // color set inline
  ownerName:    { fontSize: 15, fontWeight: '700' }, // color set inline
  ownerActions: { flexDirection: 'row' },
  ownerBtn:     { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }, // bg set inline
  ownerBtnIcon: { fontSize: 16 },

  description: { fontSize: 14, lineHeight: 22 }, // color set inline

  bookingBtn:  { backgroundColor: '#3AADBE', borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  bookingText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});