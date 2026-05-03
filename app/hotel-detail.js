import React, { useEffect, useState } from 'react';
import { Linking, Alert, Share } from 'react-native';
import {
  View, Text, StyleSheet, Image, ScrollView,
  TouchableOpacity, ActivityIndicator, StatusBar,
  Dimensions, Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db, auth } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const { width } = Dimensions.get('window');

export default function HotelDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => { fetchHotel(); }, [id]);

  // ✅ Listen to favorite status in real time
  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !id) return;
    const favRef = doc(db, 'users', user.uid, 'favorites', id);
    const unsub = onSnapshot(favRef, (snap) => setIsFav(snap.exists()));
    return unsub;
  }, [id]);

  const fetchHotel = async () => {
    try {
      const docRef = doc(db, 'hotels', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setHotel({ id: docSnap.id, ...docSnap.data() });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle favorite in Firestore
  const toggleFavorite = async () => {
    const user = auth.currentUser;
    if (!user) return Alert.alert('Login required', 'Please login to save favorites.');
    const favRef = doc(db, 'users', user.uid, 'favorites', id);
    if (isFav) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, { ...hotel, savedAt: new Date() });
    }
  };

  const handleCall = () => {
    if (hotel?.contact) Linking.openURL(`tel:${hotel.contact}`);
  };

  const handleWhatsApp = () => {
    const phone = hotel?.contact?.replace(/\D/g, '');
    if (phone) Linking.openURL(`https://wa.me/${phone}`);
  };

  // ✅ Three dots actions
  const handleShare = async () => {
    setMenuVisible(false);
    await Share.share({
      message: `Check out ${hotel?.name} at ${hotel?.location} — $${hotel?.price}/Night!`,
    });
  };

  const handleCopyLink = () => {
    setMenuVisible(false);
    Alert.alert('Link copied', `hotel-booking-app/hotel-detail?id=${id}`);
  };

  const handleReport = () => {
    setMenuVisible(false);
    Alert.alert('Report sent', 'Thank you for your feedback. We will review this listing.');
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#3AADBE" /></View>;
  if (!hotel) return <View style={styles.centered}><Text>Hotel not found.</Text></View>;

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
          <Image source={{ uri: hotel.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.imageOverlay} />

          {/* Top buttons */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
              <Text style={styles.iconBtnText}>←</Text>
            </TouchableOpacity>
            <View style={styles.topRight}>

              {/* ✅ FAVORITE BUTTON */}
              <TouchableOpacity style={styles.iconBtn} onPress={toggleFavorite}>
                <Text style={[styles.iconBtnText, { color: isFav ? '#e05c8a' : '#222' }]}>
                  {isFav ? '♥' : '♡'}
                </Text>
              </TouchableOpacity>

              {/* ✅ THREE DOTS */}
              <TouchableOpacity style={[styles.iconBtn, { marginLeft: 10 }]} onPress={() => setMenuVisible(true)}>
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

          <View style={styles.ownerCard}>
            <View style={styles.ownerLeft}>
              <View style={styles.ownerAvatar}>
                <Text style={{ color: '#aaa', fontSize: 22 }}>👤</Text>
              </View>
              <View>
                <Text style={styles.ownerLabel}>Owner</Text>
                <Text style={styles.ownerName}>{hotel.owner || 'Gilbert Alex'}</Text>
              </View>
            </View>
            <View style={styles.ownerActions}>
              <TouchableOpacity style={styles.ownerBtn} onPress={handleCall}>
                <Text style={styles.ownerBtnIcon}>📞</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.ownerBtn, { marginLeft: 10 }]} onPress={handleWhatsApp}>
                <Text style={styles.ownerBtnIcon}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {hotel.description || "A modern hotel combining sleek design, cutting-edge amenities, and warm hospitality."}
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.bookingBtn}
        onPress={() => router.push({ pathname: '/booking', params: { id: hotel.id } })}
      >
        <Text style={styles.bookingText}>Booking</Text>
      </TouchableOpacity>

      {/* ✅ THREE DOTS MENU MODAL */}
      <Modal transparent visible={menuVisible} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuBox}>
            <TouchableOpacity style={styles.menuOption} onPress={handleShare}>
              <Text style={styles.menuIcon}>🔗</Text>
              <Text style={styles.menuText}>Share Hotel</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuOption} onPress={handleCopyLink}>
              <Text style={styles.menuIcon}>📋</Text>
              <Text style={styles.menuText}>Copy Link</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuOption} onPress={handleReport}>
              <Text style={styles.menuIcon}>🚩</Text>
              <Text style={styles.menuText}>Report Listing</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { height: 280, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.38)' },
  topBar: { position: 'absolute', top: 52, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topRight: { flexDirection: 'row' },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  iconBtnText: { fontSize: 16, color: '#222' },
  imageInfo: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  imageName: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 6 },
  imageRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  imageLocation: { color: '#ddd', fontSize: 12, flex: 1 },
  ratingPill: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  ratingText: { color: '#fff', fontSize: 11 },
  imagePrice: { color: '#fff', fontWeight: '700', fontSize: 13 },
  content: { padding: 20, paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 12 },
  seeAll: { color: '#3AADBE', fontSize: 13 },
  facilitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  facilityCard: { width: (width - 60) / 4, backgroundColor: '#F7F7F7', borderRadius: 14, alignItems: 'center', paddingVertical: 14 },
  facilityIcon: { fontSize: 22, marginBottom: 6 },
  facilityText: { fontSize: 11, color: '#555', fontWeight: '500', textAlign: 'center' },
  ownerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F7F7F7', borderRadius: 16, padding: 14, marginBottom: 20 },
  ownerLeft: { flexDirection: 'row', alignItems: 'center' },
  ownerAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  ownerLabel: { fontSize: 11, color: '#999' },
  ownerName: { fontSize: 15, fontWeight: '700', color: '#111' },
  ownerActions: { flexDirection: 'row' },
  ownerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F8FA', alignItems: 'center', justifyContent: 'center' },
  ownerBtnIcon: { fontSize: 16 },
  description: { fontSize: 14, color: '#666', lineHeight: 22 },
  bookingBtn: { backgroundColor: '#3AADBE', borderRadius: 30, paddingVertical: 16, alignItems: 'center', margin: 16 },
  bookingText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Three dots menu
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 100, paddingRight: 16 },
  menuBox: { backgroundColor: '#fff', borderRadius: 16, width: 200, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  menuOption: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  menuIcon: { fontSize: 18 },
  menuText: { fontSize: 14, fontWeight: '500', color: '#1a3a42' },
  menuDivider: { height: 0.5, backgroundColor: '#edf1f2', marginHorizontal: 14 },
});
