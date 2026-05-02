import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      // 1. Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Fetch the user doc from Firestore to check role
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        // 3. Route based on role
        if (userData.role === "admin") {
          router.replace("/admin"); // go to admin dashboard
        } else {
          router.replace("/(tabs)"); // go to normal user home
        }
      } else {
        // No user doc found — treat as regular user
        router.replace("/(tabs)");
      }

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Login</Text>
        }
      </TouchableOpacity>

      <View style={styles.signupRow}>
        <Text style={styles.text}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/auth/signup")}>
          <Text style={styles.link}> Sign Up</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#dcdcdc",
  },
  title: {
    fontSize: 28,
    color: "#3aa0b8",
    marginBottom: 6,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 28,
  },
  input: {
    backgroundColor: "#fff",
    color: "#222",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#3aa0b8",
    padding: 15,
    borderRadius: 10,
    marginTop: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },
  text: {
    color: "#888",
  },
  link: {
    color: "#3aa0b8",
    fontWeight: "bold",
  },
});