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
  const [nights, setNights] = useState(2);
  const [selectedDate, setSelectedDate] = useState(null);
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

  const getCheckOut = (checkIn, n) => {
    if (!checkIn) return null;
    const d = new Date(checkIn);
    d.setDate(d.getDate() + n);
    return d.toISOString().split('T')[0];
  };

  // ── Submit booking ────────────────────────────────────────────
  const handleFinishBooking = async () => {
    if (!selectedDate) return Alert.alert('Select a date', 'Please pick a check-in date.');
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
        checkInDate:   selectedDate,
        checkOutDate:  getCheckOut(selectedDate, nights),
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

  const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Price + Nights */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>${hotel.price.toLocaleString()}/Night</Text>
          <View style={styles.counter}>
            <TouchableOpacity onPress={() => setNights(n => Math.max(1, n - 1))} style={styles.counterBtn}>
              <Text style={styles.counterSymbol}>−</Text>
            </TouchableOpacity>
            <Text style={styles.counterVal}>{nights}</Text>
            <TouchableOpacity onPress={() => setNights(n => n + 1)} style={styles.counterBtn}>
              <Text style={styles.counterSymbol}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendar}>
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
              const isSelected = dateStr === selectedDate;
              const today = new Date();
              const isPast = day && new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                  disabled={!day || isPast}
                  onPress={() => setSelectedDate(dateStr)}
                >
                  <Text style={[
                    styles.dayText,
                    isSelected && styles.dayTextSelected,
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

  priceRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: '#F7F7F7',
    borderRadius: 14, padding: 16, marginBottom: 20,
  },
  price: { fontSize: 18, fontWeight: '700', color: '#3AADBE' },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  counterBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  counterSymbol: { fontSize: 20, color: '#333', fontWeight: '600' },
  counterVal: { fontSize: 18, fontWeight: '700', color: '#111', minWidth: 24, textAlign: 'center' },

  calendar: { backgroundColor: '#F7F7F7', borderRadius: 16, padding: 16, marginBottom: 24 },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  arrow: { fontSize: 22, color: '#555', paddingHorizontal: 8 },
  monthName: { fontSize: 16, fontWeight: '700', color: '#111' },
  dayLabels: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  dayLabel: { width: 36, textAlign: 'center', fontSize: 11, color: '#999', fontWeight: '600' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', alignItems: 'center', paddingVertical: 6, borderRadius: 18 },
  dayCellSelected: { backgroundColor: '#3AADBE' },
  dayText: { fontSize: 13, color: '#222' },
  dayTextSelected: { color: '#fff', fontWeight: '700' },
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