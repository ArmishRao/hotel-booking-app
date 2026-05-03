import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { auth } from '../../firebase/firebaseConfig';
import { deleteUser } from 'firebase/auth';

export default function DeleteAccount() {

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
    <View style={styles.container}>

      <Text style={styles.title}>Delete Account</Text>

      <Text style={{ marginBottom: 20, color: '#666' }}>
        This action cannot be undone.
      </Text>

      <TouchableOpacity style={styles.btn} onPress={handleDelete}>
        <Text style={{ color: '#fff' }}>Delete My Account</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  btn: { backgroundColor: 'red', padding: 15, borderRadius: 10, alignItems: 'center' },
});