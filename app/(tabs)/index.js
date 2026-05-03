import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // ← ADD
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../../styles/HomeStyles';

export default function Home() {
  const { userData } = useContext(AuthContext);
  const router = useRouter();

  const { theme } = useTheme();
  const { colors, darkMode } = theme;

  const [hotels, setHotels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [showLocations, setShowLocations] = useState(false);

  useEffect(() => {
    fetchHotels();
    fetchCategories();
  }, []);

  const fetchHotels = async () => {
    const snapshot = await getDocs(collection(db, "hotels"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setHotels(data);
  };

  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, "categories"));
    const data = snapshot.docs.map(doc => doc.data().name);
    setCategories(data);
  };

  const normalize = (text) =>
    text?.toLowerCase().replace(/\s/g, '');

  const locations = [
    "All",
    ...new Set(
      hotels
        .map(item => item.location?.trim())
        .filter(Boolean)
    )
  ];

  const filteredHotels =
    hotels
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

  const goToDetail = (id) => {
    router.push({ pathname: '/hotel-detail', params: { id } });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.hero }]}>

        {/* LEFT: USER INFO */}
        <View style={styles.leftHeader}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            style={styles.profilePic}
          />
          <View>
            <Text style={[styles.hello, { color: 'rgba(255,255,255,0.75)' }]}>
              Hello
            </Text>
            <Text style={[styles.name, { color: '#fff' }]}>
              {userData?.name || userData?.username || 'User'}
            </Text>
          </View>
        </View>

        {/* MIDDLE: APP NAME */}
        <View style={styles.centerHeader}>
          <Text style={[styles.appName, { color: '#fff' }]}>HotelBookings</Text>
        </View>

        {/* RIGHT: ICONS */}
        <View style={styles.rightHeader}>
          <TouchableOpacity
            style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
          >
            <Text style={styles.iconText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
          >
            <Text style={styles.iconText}>⋮</Text>
          </TouchableOpacity>
        </View>

      </View>

      {/* SEARCH + LOCATION */}
      <View style={[styles.searchRow, { backgroundColor: colors.background }]}>

        <TextInput
          placeholder="Search by name..."
          placeholderTextColor={darkMode ? '#5a7a82' : '#888'}
          value={searchText}
          onChangeText={setSearchText}
          style={[
            styles.search,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: darkMode ? '#2a3d4d' : '#e0eaed',
            }
          ]}
        />

        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            style={[
              styles.locationBoxRight,
              {
                backgroundColor: colors.card,
                borderColor: darkMode ? '#2a3d4d' : '#e0eaed',
              }
            ]}
            onPress={() => setShowLocations(!showLocations)}
          >
            <Text style={{ fontSize: 12, color: colors.text }}>
              📍 {selectedLocation} ⌄
            </Text>
          </TouchableOpacity>

          {showLocations && (
            <View style={[
              styles.dropdownRight,
              {
                backgroundColor: colors.card,
                borderColor: darkMode ? '#2a3d4d' : '#e0eaed',
              }
            ]}>
              {locations.map((loc, index) => (
                <Text
                  key={index}
                  onPress={() => {
                    setSelectedLocation(loc);
                    setShowLocations(false);
                  }}
                  style={[styles.dropdownItem, { color: colors.text }]}
                >
                  {loc}
                </Text>
              ))}
            </View>
          )}
        </View>

      </View>

      {/* POPULAR */}
      <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {hotels
          .filter(item =>
            selectedLocation === "All"
              ? true
              : normalize(item.location) === normalize(selectedLocation)
          )
          .map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => goToDetail(item.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.popularCard, { backgroundColor: colors.card }]}>
                <Image source={{ uri: item.image }} style={styles.popularImage} />
                <View style={styles.overlay} />
                <View style={styles.popularContent}>
                  <Text style={styles.hotelName}>{item.name}</Text>
                  <Text style={styles.hotelLocation}>📍 {item.location}</Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.price}>${item.price}/Night</Text>
                    <View style={styles.ratingBox}>
                      <Text style={{ fontSize: 10 }}>⭐ {item.rating || 4.5}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>

      {/* CATEGORIES */}
      <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[
          styles.chip,
          { backgroundColor: colors.card, borderColor: darkMode ? '#2a3d4d' : '#e0eaed' },
          selectedCategory === "All" && styles.activeChip,
        ]}>
          <Text
            onPress={() => setSelectedCategory("All")}
            style={{ color: selectedCategory === "All" ? '#fff' : colors.text }}
          >
            All
          </Text>
        </View>

        {categories.map((item, index) => (
          <View
            key={index}
            style={[
              styles.chip,
              { backgroundColor: colors.card, borderColor: darkMode ? '#2a3d4d' : '#e0eaed' },
              selectedCategory === item && styles.activeChip,
            ]}
          >
            <Text
              onPress={() => setSelectedCategory(item)}
              style={{ color: selectedCategory === item ? '#fff' : colors.text }}
            >
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* RECOMMENDATION */}
      <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommendation</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filteredHotels.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => goToDetail(item.id)}
            activeOpacity={0.85}
          >
            <View style={[styles.recommendCard, { backgroundColor: colors.card }]}>
              <Image source={{ uri: item.image }} style={styles.recommendImage} />
              <Text style={[styles.recommendName, { color: colors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.recommendPrice, { color: colors.sectionLabel }]}>
                ${item.price}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

    </ScrollView>
  );
}