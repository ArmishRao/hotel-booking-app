import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { useRouter } from "expo-router";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // 1. Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

// inside handleSignup after createUserWithEmailAndPassword:
await setDoc(doc(db, "users", user.uid), {
  name: name,
  email: email,
  image: "https://i.pravatar.cc/150",
  role: "user",
  createdAt: new Date().toISOString(),
});
      router.replace("/(tabs)");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.menu}>⋮</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>
        Create An {"\n"}Account To Find {"\n"}Your Stillness
      </Text>

      <Text style={styles.subtitle}>
        Start A Journey Designed For Peace
      </Text>

      {/* Inputs */}
      <View style={styles.form}>

        <TextInput
          placeholder="Your name"
          placeholderTextColor="#888"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Your email"
          placeholderTextColor="#888"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Your Password"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          placeholder="Confirm Your Password"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Continue Sign Up</Text>
          }
        </TouchableOpacity>

      </View>

      {/* Login Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have account?</Text>
        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.loginText}> Log in</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dcdcdc",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  back: { fontSize: 22 },
  menu: { fontSize: 22 },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginTop: 20,
    color: "#3aa0b8",
  },
  subtitle: {
    color: "#527181",
    marginTop: 10,
    marginBottom: 20,
  },
  form: { marginTop: 10 },
  input: {
    backgroundColor: "#e5e5e5",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    color: "#000",
  },
  button: {
    backgroundColor: "#3aa0b8",
    padding: 16,
    borderRadius: 25,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  footerText: { color: "#888" },
  loginText: {
    color: "#3aa0b8",
    fontWeight: "bold",
  },
});