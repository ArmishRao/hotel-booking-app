import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useTheme } from '../../context/ThemeContext'; // ← ADD

export default function AccountScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── DARK MODE ──
  const { theme } = useTheme();
  const { colors } = theme;

  const fetchUser = async (user) => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      fetchUser(user);
    });
    return unsub;
  }, []);

  // ── DARK MODE: loader bg ──
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#3aa0b8" />
      </View>
    );
  }

  // ── DARK MODE: no user bg + text ──
  if (!userData) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>No user data found</Text>
      </View>
    );
  }

  return (
    // ── DARK MODE: main bg ──
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>

      {/* PROFILE HEADER */}
      <View style={styles.header}>
        <Image
          source={{ uri: userData.image || "https://via.placeholder.com/150" }}
          style={styles.avatar}
        />
        {/* ── DARK MODE: name + email ── */}
        <Text style={[styles.name, { color: colors.text }]}>{userData.name}</Text>
        <Text style={[styles.email, { color: colors.sectionLabel }]}>{userData.email}</Text>
      </View>

      {/* INFO CARD */}
      {/* ── DARK MODE: card bg ── */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>

        <Text style={[styles.label, { color: colors.sectionLabel }]}>Full Name</Text>
        <Text style={[styles.value, { color: colors.text }]}>{userData.name}</Text>

        <Text style={[styles.label, { color: colors.sectionLabel }]}>Email</Text>
        <Text style={[styles.value, { color: colors.text }]}>{userData.email}</Text>

        <Text style={[styles.label, { color: colors.sectionLabel }]}>User ID</Text>
        <Text style={[styles.value, { color: colors.text }]}>{auth.currentUser?.uid}</Text>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    // backgroundColor removed — set inline dynamically
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor removed — set inline dynamically
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    // color removed — set inline dynamically
  },

  email: {
    fontSize: 14,
    // color removed — set inline dynamically
  },

  card: {
    // backgroundColor removed — set inline dynamically
    padding: 15,
    borderRadius: 10,
  },

  label: {
    fontSize: 12,
    // color removed — set inline dynamically
    marginTop: 10,
  },

  value: {
    fontSize: 14,
    fontWeight: '500',
    // color removed — set inline dynamically
  },

});