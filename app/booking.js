import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const TIMES = ['06:00 WIB', '07:00 WIB', '08:00 WIB', '09:00 WIB', '10:00 WIB', '11:00 WIB'];

export default function BookingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const auth = getAuth();

  const [hotel, setHotel] = useState(null);
  const [nights, setNights] = useState(0);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [selecting, setSelecting] = useState('checkin'); // 'checkin' | 'checkout'
  const [selectedTime, setSelectedTime] = useState('09:00 WIB');
  const [guests, setGuests] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => { fetchHotel(); }, []);

  const fetchHotel = async () => {
    const snap = await getDoc(doc(db, 'hotels', id));
    if (snap.exists()) setHotel({ id: snap.id, ...snap.data() });
  };

  // ── Calendar helpers ──────────────────────────────────────────
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };

  const { firstDay, daysInMonth, year, month } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const formatDate = (d) => {
    const date = new Date(year, month, d);
    return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
  };

  // ── Two-tap date selection ────────────────────────────────────
  const handleDayPress = (dateStr) => {
    if (selecting === 'checkin') {
      setCheckIn(dateStr);
      setCheckOut(null);        // reset checkout when checkin changes
      setNights(0);
      setSelecting('checkout');
    } else {
      if (dateStr <= checkIn) {
        Alert.alert('Invalid Date', 'Check-out must be after check-in.');
        return;
      }
      setCheckOut(dateStr);
      setSelecting('checkin'); // reset for next time

      // Auto-calculate nights from date difference
      const diff = (new Date(dateStr) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
      setNights(diff);
    }
  };

  // ── Submit booking ────────────────────────────────────────────
  const handleFinishBooking = async () => {
    if (!checkIn || !checkOut) return Alert.alert('Select Dates', 'Please pick check-in and check-out dates.');
    if (!guests) return Alert.alert('Guests', 'Please enter number of guests.');

    const user = auth.currentUser;
    if (!user) return Alert.alert('Not logged in');

    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        userId:        user.uid,
        hotelId:       hotel.id,
        hotelName:     hotel.name,
        hotelImage:    hotel.image,
        hotelLocation: hotel.location,
        pricePerNight: hotel.price,
        nights,
        totalPrice:    hotel.price * nights,
        checkInDate:   checkIn,
        checkOutDate:  checkOut,
        selectedTime,
        guests:        parseInt(guests),
        status:        'confirmed',
        bookedAt:      Timestamp.now(),
      });

      Alert.alert('Booking Confirmed! 🎉', `You booked ${hotel.name} for ${nights} night(s).`, [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Booking failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!hotel) return <ActivityIndicator style={{ flex: 1 }} color="#3AADBE" />;

  // ── Render calendar cells ─────────────────────────────────────
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Price + Nights (now auto-calculated, counter removed) */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>${hotel.price.toLocaleString()}/Night</Text>
          <Text style={styles.nightsBadge}>
            {nights > 0 ? `${nights} Night${nights > 1 ? 's' : ''}` : '— Nights'}
          </Text>
        </View>

        {/* Check-in / Check-out summary */}
        <View style={styles.dateRow}>
          <View style={[styles.dateBadge, checkIn && styles.dateBadgeActive]}>
            <Text style={styles.dateBadgeLabel}>Check-in</Text>
            <Text style={[styles.dateBadgeValue, checkIn && styles.dateBadgeValueActive]}>
              {checkIn || 'Select'}
            </Text>
          </View>
          <Text style={styles.dateArrow}>→</Text>
          <View style={[styles.dateBadge, checkOut && styles.dateBadgeActive]}>
            <Text style={styles.dateBadgeLabel}>Check-out</Text>
            <Text style={[styles.dateBadgeValue, checkOut && styles.dateBadgeValueActive]}>
              {checkOut || 'Select'}
            </Text>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendar}>

          {/* Hint label */}
          <Text style={styles.selectingHint}>
            {selecting === 'checkin'
              ? '👆 Tap to select Check-in date'
              : '👆 Now tap Check-out date'}
          </Text>

          <View style={styles.calHeader}>
            <TouchableOpacity onPress={prevMonth}><Text style={styles.arrow}>‹</Text></TouchableOpacity>
            <Text style={styles.monthName}>{monthName}</Text>
            <TouchableOpacity onPress={nextMonth}><Text style={styles.arrow}>›</Text></TouchableOpacity>
          </View>

          <View style={styles.dayLabels}>
            {DAYS.map(d => <Text key={d} style={styles.dayLabel}>{d}</Text>)}
          </View>

          <View style={styles.daysGrid}>
            {cells.map((day, i) => {
              const dateStr = day ? formatDate(day) : null;
              const isCheckIn  = dateStr === checkIn;
              const isCheckOut = dateStr === checkOut;
              const isInRange  = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;
              const today = new Date();
              const isPast = day && new Date(year, month, day) < new Date(
                today.getFullYear(), today.getMonth(), today.getDate()
              );

              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.dayCell,
                    (isCheckIn || isCheckOut) && styles.dayCellSelected,
                    isInRange && styles.dayCellRange,
                  ]}
                  disabled={!day || isPast}
                  onPress={() => handleDayPress(dateStr)}
                >
                  <Text style={[
                    styles.dayText,
                    (isCheckIn || isCheckOut) && styles.dayTextSelected,
                    isInRange && styles.dayTextRange,
                    isPast && styles.dayTextPast,
                  ]}>
                    {day || ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Time Slots */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <Text style={styles.custom}>Custom</Text>
        </View>
        <View style={styles.timeGrid}>
          {TIMES.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.timeChip, selectedTime === t && styles.timeChipSelected]}
              onPress={() => setSelectedTime(t)}
            >
              <Text style={[styles.timeText, selectedTime === t && styles.timeTextSelected]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Guests */}
        <Text style={styles.sectionTitle}>Number of Guests</Text>
        <TextInput
          style={styles.input}
          placeholder="Type here"
          keyboardType="numeric"
          value={guests}
          onChangeText={setGuests}
        />

      </ScrollView>

      {/* Finish Booking */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.finishBtn} onPress={handleFinishBooking} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.finishText}>Finish Booking</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20, paddingBottom: 100 },

  // Price row — no more manual counter
  priceRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: '#F7F7F7',
    borderRadius: 14, padding: 16, marginBottom: 12,
  },
  price: { fontSize: 18, fontWeight: '700', color: '#3AADBE' },
  nightsBadge: { fontSize: 15, fontWeight: '600', color: '#555' },

  // Check-in / Check-out summary row
  dateRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 16,
  },
  dateBadge: {
    flex: 1, backgroundColor: '#F7F7F7', borderRadius: 12,
    padding: 12, alignItems: 'center',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  dateBadgeActive: { borderColor: '#3AADBE' },
  dateBadgeLabel: { fontSize: 11, color: '#999', marginBottom: 4 },
  dateBadgeValue: { fontSize: 13, fontWeight: '600', color: '#aaa' },
  dateBadgeValueActive: { color: '#111' },
  dateArrow: { fontSize: 18, color: '#3AADBE', marginHorizontal: 10 },

  // Hint
  selectingHint: {
    textAlign: 'center', color: '#3AADBE',
    fontSize: 13, marginBottom: 10, fontWeight: '500',
  },

  calendar: { backgroundColor: '#F7F7F7', borderRadius: 16, padding: 16, marginBottom: 24 },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  arrow: { fontSize: 22, color: '#555', paddingHorizontal: 8 },
  monthName: { fontSize: 16, fontWeight: '700', color: '#111' },
  dayLabels: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  dayLabel: { width: 36, textAlign: 'center', fontSize: 11, color: '#999', fontWeight: '600' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },

  dayCell: { width: '14.28%', alignItems: 'center', paddingVertical: 6, borderRadius: 18 },
  dayCellSelected: { backgroundColor: '#3AADBE' },
  dayCellRange: { backgroundColor: '#D0F0F4' },

  dayText: { fontSize: 13, color: '#222' },
  dayTextSelected: { color: '#fff', fontWeight: '700' },
  dayTextRange: { color: '#3AADBE' },
  dayTextPast: { color: '#ccc' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111', marginBottom: 12 },
  custom: { color: '#3AADBE', fontSize: 13 },

  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  timeChip: {
    borderWidth: 1.5, borderColor: '#3AADBE', borderRadius: 20,
    paddingVertical: 8, paddingHorizontal: 16,
  },
  timeChipSelected: { backgroundColor: '#3AADBE' },
  timeText: { color: '#3AADBE', fontSize: 13, fontWeight: '500' },
  timeTextSelected: { color: '#fff' },

  input: {
    borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12,
    padding: 14, fontSize: 14, color: '#333', marginBottom: 20,
  },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
  },
  finishBtn: {
    backgroundColor: '#3AADBE', borderRadius: 30,
    paddingVertical: 16, alignItems: 'center',
  },
  finishText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});