import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { auth } from '../../firebase/firebaseConfig';
import { deleteUser } from 'firebase/auth';
import { useTheme } from '../../context/ThemeContext'; // ← ADD

export default function DeleteAccount() {

  // ── DARK MODE ──
  const { theme } = useTheme();
  const { colors } = theme;

  const handleDelete = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      await deleteUser(user);
      Alert.alert("Deleted", "Account deleted successfully");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Re-login required to delete account");
    }
  };

  return (
    // ── DARK MODE: main bg ──
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* ── DARK MODE: title ── */}
      <Text style={[styles.title, { color: colors.text }]}>
        Delete Account
      </Text>

      {/* ── DARK MODE: subtitle ── */}
      <Text style={{ marginBottom: 20, color: colors.sectionLabel }}>
        This action cannot be undone.
      </Text>

      {/* Button stays red — it's a danger action, unchanged ── */}
      <TouchableOpacity style={styles.btn} onPress={handleDelete}>
        <Text style={{ color: '#fff' }}>Delete My Account</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    // backgroundColor removed — set inline dynamically
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    // color removed — set inline dynamically
  },
  btn: {
    backgroundColor: 'red', // stays red — danger action
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});