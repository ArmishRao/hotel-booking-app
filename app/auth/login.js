import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext"; // ← ADD

export default function Login() {
  const router = useRouter();

  // ── DARK MODE ──
  const { theme } = useTheme();
  const { colors, darkMode } = theme;

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/(tabs)");
        }
      } else {
        router.replace("/(tabs)");
      }

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ── DARK MODE: container bg ──
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <Text style={styles.title}>Welcome Back</Text>
      {/* ── DARK MODE: subtitle ── */}
      <Text style={[styles.subtitle, { color: darkMode ? '#5a8a95' : '#888' }]}>
        Sign in to your account
      </Text>

      {/* ── DARK MODE: inputs ── */}
      <TextInput
        placeholder="Email"
        placeholderTextColor={darkMode ? '#5a7a82' : '#aaa'}
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: darkMode ? '#1e3d47' : '#ddd',
          }
        ]}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={darkMode ? '#5a7a82' : '#aaa'}
        secureTextEntry
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: darkMode ? '#1e3d47' : '#ddd',
          }
        ]}
        onChangeText={setPassword}
        value={password}
      />

      {/* Button — brand color, unchanged */}
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
        {/* ── DARK MODE: signup text ── */}
        <Text style={[styles.text, { color: darkMode ? '#5a8a95' : '#888' }]}>
          Don't have an account?
        </Text>
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
    padding: 24,                      // bg set inline
  },
  title: {
    fontSize: 28,
    color: "#3aa0b8",                 // brand color, unchanged
    marginBottom: 6,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 28,                 // color set inline
  },
  input: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 15,
    borderWidth: 1,                   // bg, color, borderColor set inline
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
  text: { },                          // color set inline
  link: {
    color: "#3aa0b8",
    fontWeight: "bold",
  },
});