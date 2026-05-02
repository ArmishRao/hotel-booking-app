import React, { useEffect, useState } from 'react';
import { useRouter } from "expo-router";

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';

import styles from '../../styles/ProfileStyles';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutModal, setLogoutModal] = useState(false);

  const fetchUserData = async (user) => {
    try {
      if (!user) return;

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
      fetchUserData(user);
    });

    return unsub;
  }, []);


// inside the component:
    const router = useRouter();

    const handleLogout = async () => {
    await signOut(auth);
    setLogoutModal(false);
    router.replace("/auth/login");  // ← fixed
    };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const menuItems = [
    { title: "My Account", screen: "Account" },
    { title: "Favorite", screen: "Favorite" },
    { title: "Setting", screen: "Setting" },
    { title: "Notification", screen: "Notification" },
    { title: "History", screen: "History" },
    { title: "Terms & Condition",screen: "Terms" },
    { title: "Help & Support", screen: "Support" },
  ];

  return (
    <View style={styles.container}>

      {/* PROFILE CARD */}
      <View style={styles.headerCard}>
        <Image
          source={{ uri: userData?.image || "https://via.placeholder.com/150" }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{userData?.name}</Text>
        <Text style={styles.email}>{userData?.email}</Text>
      </View>

      {/* MENU */}
      <View style={styles.menuCard}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuText}>{item.title}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => setLogoutModal(true)}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* LOGOUT CONFIRM MODAL */}
      <Modal transparent visible={logoutModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
              Are you sure you want to logout?
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

              <TouchableOpacity
                onPress={() => setLogoutModal(false)}
                style={styles.cancelBtn}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                style={styles.confirmBtn}
              >
                <Text style={{ color: '#fff' }}>Logout</Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}