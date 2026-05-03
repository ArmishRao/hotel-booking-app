import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function AccountScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text>No user data found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* PROFILE HEADER */}
      <View style={styles.header}>
        <Image
          source={{ uri: userData.image || "https://via.placeholder.com/150" }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      {/* INFO CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>{userData.name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{userData.email}</Text>

        <Text style={styles.label}>User ID</Text>
        <Text style={styles.value}>{auth.currentUser?.uid}</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },

  email: {
    fontSize: 14,
    color: '#666',
  },

  card: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },

  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },

  value: {
    fontSize: 14,
    fontWeight: '500',
  },
});