import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';
import { useRouter } from 'expo-router';

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const ref = collection(db, 'users', user.uid, 'favorites');
    const unsub = onSnapshot(ref, (snap) => {
      setFavorites(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const removeFav = async (id) => {
    const user = auth.currentUser;
    await deleteDoc(doc(db, 'users', user.uid, 'favorites', id));
  };

  if (loading) return <View style={s.centered}><ActivityIndicator color="#3AADBE" size="large" /></View>;

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Favorites</Text>
        <View style={{ width: 36 }} />
      </View>

      {favorites.length === 0 ? (
        <View style={s.centered}>
          <Text style={{ fontSize: 40 }}>🤍</Text>
          <Text style={s.emptyText}>No favorites yet</Text>
          <Text style={s.emptySub}>Hotels you save will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.card}
              onPress={() => router.push({ pathname: '/hotel-detail', params: { id: item.id } })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.image }} style={s.cardImg} />
              <View style={s.cardInfo}>
                <Text style={s.cardName}>{item.name}</Text>
                <Text style={s.cardLoc}>📍 {item.location}</Text>
                <Text style={s.cardPrice}>${item.price}/Night</Text>
              </View>
              <TouchableOpacity onPress={() => removeFav(item.id)} style={s.heartBtn}>
                <Text style={{ fontSize: 20, color: '#e05c8a' }}>♥</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#3AADBE' },
  backBtn: { width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#fff', fontSize: 18 },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#1a3a42', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#7fa0a8', marginTop: 4 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', alignItems: 'center' },
  cardImg: { width: 90, height: 90 },
  cardInfo: { flex: 1, padding: 12 },
  cardName: { fontSize: 14, fontWeight: '700', color: '#1a3a42', marginBottom: 4 },
  cardLoc: { fontSize: 12, color: '#7fa0a8', marginBottom: 4 },
  cardPrice: { fontSize: 13, fontWeight: '600', color: '#3AADBE' },
  heartBtn: { padding: 16 },
});