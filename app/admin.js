import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase/firebaseConfig";
import { useRouter } from "expo-router";

const EMPTY_FORM = {
  name: "",
  location: "",
  price: "",
  rating: "",
  category: "",
  image: "",
  description: "",
  owner: "",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = adding new
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  // ─── FETCH ───────────────────────────────────────────────
  const fetchHotels = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "hotels"));
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setHotels(data);
    } catch (e) {
      Alert.alert("Error", "Failed to load hotels.");
    } finally {
      setLoading(false);
    }
  };

  // ─── OPEN MODAL ──────────────────────────────────────────
  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalVisible(true);
  };

  const openEdit = (hotel) => {
    setEditingId(hotel.id);
    setForm({
      name: hotel.name || "",
      location: hotel.location || "",
      price: String(hotel.price || ""),
      rating: String(hotel.rating || ""),
      category: hotel.category || "",
      image: hotel.image || "",
      description: hotel.description || "",
      owner: hotel.owner || "",
    });
    setModalVisible(true);
  };

  // ─── SAVE (add or update) ─────────────────────────────────
  const handleSave = async () => {
    if (!form.name || !form.location || !form.price) {
      Alert.alert("Validation", "Name, Location and Price are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        rating: Number(form.rating) || 4.5,
      };

      if (editingId) {
        // UPDATE existing hotel
        await updateDoc(doc(db, "hotels", editingId), payload);
      } else {
        // ADD new hotel
        await addDoc(collection(db, "hotels"), payload);
      }

      setModalVisible(false);
      fetchHotels();
    } catch (e) {
      Alert.alert("Error", "Could not save hotel. " + e.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── DELETE ───────────────────────────────────────────────
const handleDelete = async (hotel) => {
  const confirmed = window.confirm(`Are you sure you want to delete "${hotel.name}"?`);
  if (!confirmed) return;

  try {
    await deleteDoc(doc(db, "hotels", hotel.id));
    setHotels((prev) => prev.filter((h) => h.id !== hotel.id));
  } catch (e) {
    window.alert("Could not delete: " + e.message);
  }
};

  // ─── LOGOUT ──────────────────────────────────────────────
  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/auth/login");
  };

  // ─── RENDER ───────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topLabel}>Admin Panel</Text>
          <Text style={styles.topTitle}>🏨 Hotel Manager</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* STATS BAR */}
      <View style={styles.statsBar}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{hotels.length}</Text>
          <Text style={styles.statLabel}>Hotels</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>
            {[...new Set(hotels.map((h) => h.location).filter(Boolean))].length}
          </Text>
          <Text style={styles.statLabel}>Locations</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>
            {[...new Set(hotels.map((h) => h.category).filter(Boolean))].length}
          </Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
      </View>

      {/* ADD BUTTON */}
      <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
        <Text style={styles.addBtnText}>+ Add New Hotel</Text>
      </TouchableOpacity>

      {/* HOTEL LIST */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3AADBE"
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {hotels.map((hotel) => (
            <View key={hotel.id} style={styles.hotelCard}>
              {/* Image */}
              <Image
                source={{ uri: hotel.image }}
                style={styles.hotelImage}
                resizeMode="cover"
              />

              {/* Info */}
              <View style={styles.hotelInfo}>
                <Text style={styles.hotelName} numberOfLines={1}>
                  {hotel.name}
                </Text>
                <Text style={styles.hotelMeta}>📍 {hotel.location}</Text>
                <View style={styles.hotelRow}>
                  <Text style={styles.hotelPrice}>${hotel.price}/Night</Text>
                  <Text style={styles.hotelCategory}>{hotel.category}</Text>
                  <Text style={styles.hotelRating}>⭐ {hotel.rating}</Text>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.hotelActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => openEdit(hotel)}
                >
                  <Text style={styles.editBtnText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(hotel)}
                >
                  <Text style={styles.deleteBtnText}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ADD / EDIT MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>
              {editingId ? "Edit Hotel" : "Add New Hotel"}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { key: "name", label: "Hotel Name *", placeholder: "e.g. Alpine Lodge" },
                { key: "location", label: "Location *", placeholder: "e.g. Swiss Alps, Switzerland" },
                { key: "price", label: "Price per Night *", placeholder: "e.g. 250", keyboard: "numeric" },
                { key: "rating", label: "Rating (1-5)", placeholder: "e.g. 4.7", keyboard: "numeric" },
                { key: "category", label: "Category", placeholder: "e.g. Mountain / Beach / City" },
                { key: "image", label: "Image URL", placeholder: "https://..." },
                { key: "owner", label: "Owner Name", placeholder: "e.g. Gilbert Alex" },
                { key: "description", label: "Description", placeholder: "Short description...", multiline: true },
              ].map((field) => (
                <View key={field.key} style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <TextInput
                    style={[styles.fieldInput, field.multiline && { height: 80, textAlignVertical: "top" }]}
                    placeholder={field.placeholder}
                    placeholderTextColor="#bbb"
                    value={form[field.key]}
                    onChangeText={(v) => setForm((prev) => ({ ...prev, [field.key]: v }))}
                    keyboardType={field.keyboard || "default"}
                    multiline={field.multiline || false}
                  />
                </View>
              ))}
            </ScrollView>

            {/* Modal Buttons */}
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>
                    {editingId ? "Update" : "Add Hotel"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6FA" },

  /* TOP BAR */
  topBar: {
    backgroundColor: "#1a1a2e",
    padding: 20,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topLabel: { color: "#3AADBE", fontSize: 11, letterSpacing: 1.5 },
  topTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginTop: 2 },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  /* STATS */
  statsBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },
  statBox: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 24, fontWeight: "800", color: "#3AADBE" },
  statLabel: { fontSize: 11, color: "#999", marginTop: 2 },

  /* ADD BUTTON */
  addBtn: {
    backgroundColor: "#3AADBE",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  /* LIST */
  list: { flex: 1, paddingHorizontal: 16 },

  /* HOTEL CARD */
  hotelCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    overflow: "hidden",
    elevation: 2,
  },
  hotelImage: { width: 90, height: 90 },
  hotelInfo: { flex: 1, padding: 10, justifyContent: "space-between" },
  hotelName: { fontSize: 15, fontWeight: "700", color: "#111" },
  hotelMeta: { fontSize: 11, color: "#888", marginTop: 2 },
  hotelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  hotelPrice: { fontSize: 12, fontWeight: "700", color: "#3AADBE" },
  hotelCategory: {
    fontSize: 10, color: "#fff", backgroundColor: "#3AADBE",
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8,
  },
  hotelRating: { fontSize: 11, color: "#555" },

  hotelActions: {
    justifyContent: "space-around",
    alignItems: "center",
    padding: 8,
  },
  editBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#EAF8FB", justifyContent: "center", alignItems: "center",
    marginBottom: 6,
  },
  editBtnText: { fontSize: 16 },
  deleteBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#FDECEA", justifyContent: "center", alignItems: "center",
  },
  deleteBtnText: { fontSize: 16 },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20, fontWeight: "800", color: "#111", marginBottom: 18,
  },

  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, color: "#888", marginBottom: 5, fontWeight: "600" },
  fieldInput: {
    backgroundColor: "#F4F6FA",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#111",
    borderWidth: 1,
    borderColor: "#E8EDF2",
  },

  modalBtns: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1, padding: 14, borderRadius: 12,
    backgroundColor: "#F4F6FA", alignItems: "center",
  },
  cancelBtnText: { color: "#666", fontWeight: "600" },
  saveBtn: {
    flex: 2, padding: 14, borderRadius: 12,
    backgroundColor: "#3AADBE", alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});