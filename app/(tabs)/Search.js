import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // ← ADD

export default function SearchScreen() {
  const { userData } = useContext(AuthContext);

  // ── DARK MODE ──
  const { theme } = useTheme();
  const { colors, darkMode } = theme;

  const [hotels, setHotels] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [showLocations, setShowLocations] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    const snapshot = await getDocs(collection(db, "hotels"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setHotels(data);
  };

  const locations = [
    "All",
    ...new Set(
      hotels
        .map(item => item.location?.trim())
        .filter(Boolean)
    )
  ];

  const normalize = (text) =>
    text?.toLowerCase().replace(/\s/g, '');

  const filteredHotels = hotels
    .filter(item =>
      selectedLocation === "All"
        ? true
        : normalize(item.location) === normalize(selectedLocation)
    )
    .filter(item =>
      selectedCategory === "All"
        ? true
        : item.category === selectedCategory
    )
    .filter(item =>
      item.name?.toLowerCase().includes(searchText.toLowerCase())
    );

  const categories = ["All", "City", "Beach", "Mountain", "Village"];

  return (
    // ── DARK MODE: main bg ──
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            style={styles.profilePic}
          />
          <View>
            {/* ── DARK MODE: hello + name ── */}
            <Text style={[styles.hello, { color: darkMode ? '#5a8a95' : '#777' }]}>
              Hello
            </Text>
            <Text style={[styles.name, { color: colors.text }]}>
              {userData?.name || userData?.username || 'User'}
            </Text>
          </View>
        </View>

        <View style={styles.rightHeader}>
          {/* ── DARK MODE: icon circles ── */}
          <TouchableOpacity
            style={[styles.iconCircle, { backgroundColor: colors.card }]}
          >
            <Text>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconCircle, { backgroundColor: colors.card }]}
          >
            <Text>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH + LOCATION */}
      <View style={styles.searchContainer}>

        {/* ── DARK MODE: search bar ── */}
        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <TextInput
            placeholder="Search..."
            placeholderTextColor={darkMode ? '#5a7a82' : '#888'}
            value={searchText}
            onChangeText={setSearchText}
            style={[{ flex: 1 }, { color: colors.text }]}
          />
          <Text>🔍</Text>
        </View>

        <View style={{ position: 'relative' }}>
          {/* ── DARK MODE: location pill ── */}
          <TouchableOpacity
            style={[
              styles.locationPill,
              { backgroundColor: darkMode ? '#1a3a4a' : '#DFF3F0' }
            ]}
            onPress={() => setShowLocations(!showLocations)}
          >
            <Text style={[styles.locationText, { color: colors.text }]}>
              📍 {selectedLocation} ⌄
            </Text>
          </TouchableOpacity>

          {/* ── DARK MODE: dropdown ── */}
          {showLocations && (
            <View style={[styles.dropdown, { backgroundColor: colors.card }]}>
              {locations.map((loc, index) => (
                <Text
                  key={index}
                  style={[styles.dropdownItem, { color: colors.text }]}
                  onPress={() => {
                    setSelectedLocation(loc);
                    setShowLocations(false);
                  }}
                >
                  {loc}
                </Text>
              ))}
            </View>
          )}
        </View>

      </View>

      {/* CATEGORIES */}
      {/* ── DARK MODE: section titles ── */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      {/* ── DARK MODE: selected location text ── */}
      <Text style={[styles.selectedLocationText, { color: darkMode ? '#5a8a95' : '#888' }]}>
        Showing for: {selectedLocation}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryPill,
              // ── DARK MODE: unselected chip bg ──
              { backgroundColor: darkMode ? colors.card : '#F1F1F1' },
              selectedCategory === item && styles.activeCategory,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                // ── DARK MODE: unselected chip text ──
                { color: selectedCategory === item ? '#fff' : colors.text },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FOR YOU */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>For You</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      {/* Cards — image cards stay the same, text on top of image is always white */}
      {filteredHotels.map(item => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          <View style={styles.overlay} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardLocation}>📍 {item.location}</Text>
            <View style={styles.cardBottom}>
              <Text style={styles.cardPrice}>${item.price}/Night</Text>
              <View style={styles.rating}>
                <Text>⭐ {item.rating || 4.9}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 15,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profilePic: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
  },

  hello: {
    fontSize: 12,
    // color removed — set inline dynamically
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    // color removed — set inline dynamically
  },

  rightHeader: {
    flexDirection: 'row',
  },

  iconCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    // backgroundColor removed — set inline dynamically
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  /* SEARCH */
  searchContainer: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
    alignItems: 'center',
  },

  locationPill: {
    // backgroundColor removed — set inline dynamically
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  locationText: {
    fontSize: 12,
    fontWeight: '600',
    // color removed — set inline dynamically
  },

  searchBar: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor removed — set inline dynamically
    borderRadius: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },

  /* SECTION */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    // color removed — set inline dynamically
  },

  seeAll: {
    color: '#2CB9B0',
    fontSize: 12,
  },

  /* CATEGORY */
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    // backgroundColor removed — set inline dynamically
    marginRight: 10,
  },

  activeCategory: {
    backgroundColor: '#2CB9B0',
  },

  categoryText: {
    fontSize: 12,
    // color removed — set inline dynamically
  },

  /* CARD — unchanged, text sits on image so always white */
  card: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
  },

  cardImage: {
    width: '100%',
    height: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  cardContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  cardLocation: {
    color: '#ddd',
    fontSize: 12,
    marginVertical: 4,
  },

  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardPrice: {
    color: '#fff',
    fontWeight: 'bold',
  },

  rating: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  dropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    // backgroundColor removed — set inline dynamically
    borderRadius: 10,
    elevation: 5,
    padding: 10,
    zIndex: 999,
  },

  dropdownItem: {
    paddingVertical: 5,
    // color removed — set inline dynamically
  },

  selectedLocationText: {
    fontSize: 12,
    marginBottom: 10,
    // color removed — set inline dynamically
  },

});