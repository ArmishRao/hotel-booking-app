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

export default function SearchScreen() {
  const { userData } = useContext(AuthContext);
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

  // ✅ Extract locations dynamically
  const locations = [
    "All",
    ...new Set(
      hotels
        .map(item => item.location?.trim())
        .filter(Boolean)
    )
  ];

  // ✅ Normalize helper
  const normalize = (text) =>
    text?.toLowerCase().replace(/\s/g, '');

  // ✅ FILTER LOGIC (COMBINED)
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            style={styles.profilePic}
          />
          <View>
            <Text style={styles.hello}>Hello</Text>
            <Text style={styles.name}>{userData?.name || userData?.username || 'User'}</Text>
            
            
          </View>
        </View>

        <View style={styles.rightHeader}>
          <TouchableOpacity style={styles.iconCircle}>
            <Text>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <Text>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH + LOCATION */}
      <View style={styles.searchContainer}>

        {/* SEARCH LEFT */}
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
            style={{ flex: 1 }}
          />
          <Text>🔍</Text>
        </View>

        {/* LOCATION RIGHT */}
        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            style={styles.locationPill}
            onPress={() => setShowLocations(!showLocations)}
          >
            <Text style={styles.locationText}>
              📍 {selectedLocation} ⌄
            </Text>
          </TouchableOpacity>

          {showLocations && (
            <View style={styles.dropdown}>
              {locations.map((loc, index) => (
                <Text
                  key={index}
                  style={styles.dropdownItem}
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
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      {/* Selected Location Text */}
      <Text style={styles.selectedLocationText}>
        Showing for: {selectedLocation}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryPill,
              selectedCategory === item && styles.activeCategory
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && { color: '#fff' }
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FOR YOU */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>For You</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      {filteredHotels.map(item => (
        <View key={item.id} style={styles.card}>

          <Image source={{ uri: item.image }} style={styles.cardImage} />

          <View style={styles.overlay} />

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardLocation}>📍 {item.location}</Text>

            <View style={styles.cardBottom}>
              <Text style={styles.cardPrice}>
                ${item.price}/Night
              </Text>

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
    backgroundColor: '#fff',
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
    color: '#777',
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  rightHeader: {
    flexDirection: 'row',
  },

  iconCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#F1F1F1',
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
    backgroundColor: '#DFF3F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  locationText: {
    fontSize: 12,
    fontWeight: '600',
  },

  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
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
    backgroundColor: '#F1F1F1',
    marginRight: 10,
  },

  activeCategory: {
    backgroundColor: '#2CB9B0',
  },

  categoryText: {
    fontSize: 12,
  },

  /* CARD */
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
  backgroundColor: '#fff',
  borderRadius: 10,
  elevation: 5,
  padding: 10,
  zIndex: 999,
},

dropdownItem: {
  paddingVertical: 5,
},

selectedLocationText: {
  fontSize: 12,
  color: '#888',
  marginBottom: 10,
},

});