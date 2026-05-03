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
import { useTheme } from "../../context/ThemeContext"; // ← ADD

export default function Signup() {
  const router = useRouter();

  // ── DARK MODE ──
  const { theme } = useTheme();
  const { colors, darkMode } = theme;

  const [name, setName]                     = useState("");
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading]               = useState(false);

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

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
    // ── DARK MODE: container bg ──
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          {/* ── DARK MODE: back + menu icons ── */}
          <Text style={[styles.back, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.menu, { color: colors.text }]}>⋮</Text>
      </View>

      {/* Title — brand color, unchanged */}
      <Text style={styles.title}>
        Create An {"\n"}Account To Find {"\n"}Your Stillness
      </Text>

      {/* ── DARK MODE: subtitle ── */}
      <Text style={[styles.subtitle, { color: darkMode ? '#5a8a95' : '#527181' }]}>
        Start A Journey Designed For Peace
      </Text>

      {/* Inputs */}
      <View style={styles.form}>

        <TextInput
          placeholder="Your name"
          placeholderTextColor={darkMode ? '#5a7a82' : '#888'}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
            }
          ]}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Your email"
          placeholderTextColor={darkMode ? '#5a7a82' : '#888'}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
            }
          ]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Your Password"
          placeholderTextColor={darkMode ? '#5a7a82' : '#888'}
          secureTextEntry
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
            }
          ]}
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          placeholder="Confirm Your Password"
          placeholderTextColor={darkMode ? '#5a7a82' : '#888'}
          secureTextEntry
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
            }
          ]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Button — brand color, unchanged */}
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

      {/* Footer */}
      <View style={styles.footer}>
        {/* ── DARK MODE: footer text ── */}
        <Text style={[styles.footerText, { color: darkMode ? '#5a8a95' : '#888' }]}>
          Already have account?
        </Text>
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
    paddingHorizontal: 20,            // bg set inline
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  back: { fontSize: 22 },             // color set inline
  menu: { fontSize: 22 },             // color set inline
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginTop: 20,
    color: "#3aa0b8",                 // brand color, unchanged
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 20,                 // color set inline
  },
  form: { marginTop: 10 },
  input: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,                 // bg + color set inline
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
  footerText: {},                     // color set inline
  loginText: {
    color: "#3aa0b8",
    fontWeight: "bold",
  },
});