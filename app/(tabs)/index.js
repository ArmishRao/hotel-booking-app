import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

export default function Home() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Hello</Text>
          <Text style={styles.name}>Arcadia</Text>
        </View>

        <View style={styles.headerIcons}>
          <View style={styles.iconBox} />
          <View style={styles.iconBox} />
        </View>
      </View>

      {/* SEARCH */}
      <View style={styles.searchRow}>
        <View style={styles.locationBox}>
          <Text>📍 BALI, IDN</Text>
        </View>

        <TextInput
          placeholder="Search..."
          style={styles.search}
        />
      </View>

      {/* POPULAR */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      <View style={styles.card}>
        <Image
    source={{ uri: "https://images.unsplash.com/photo-1566073771259-6a8506099945" }}
    style={styles.cardImage}
  />
        <Text style={styles.cardTitle}>Oce Hotel</Text>
        <Text style={styles.cardLocation}>Bandung, Indonesia</Text>
        <Text style={styles.price}>$400,000/Night</Text>
      </View>

      {/* CATEGORIES */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['City', 'Beach', 'Mountain', 'Village'].map((item, index) => (
          <View key={index} style={styles.chip}>
            <Text>{item}</Text>
          </View>
        ))}
      </ScrollView>

      {/* RECOMMENDATION */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommendation</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.smallCard}>
          <Text>Palace Hotel</Text>
        </View>

        <View style={styles.smallCard}>
          <Text>Tower Hotel</Text>
        </View>
      </ScrollView>

    </ScrollView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    alignItems: 'center',
  },

  hello: {
    fontSize: 14,
    color: '#777',
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },

  iconBox: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },

  searchRow: {
    marginTop: 20,
  },

  locationBox: {
    backgroundColor: '#e6f7ff',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    width: 120,
  },

  search: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  seeAll: {
    color: 'gray',
  },

  card: {
    backgroundColor: '#ddd',
    padding: 20,
    borderRadius: 15,
    marginTop: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  cardLocation: {
    color: '#555',
  },

  price: {
    marginTop: 10,
    fontWeight: 'bold',
  },

  chip: {
    backgroundColor: '#e6f7ff',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    marginTop: 10,
  },

  smallCard: {
    width: 140,
    height: 100,
    backgroundColor: '#eee',
    borderRadius: 15,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
  width: '100%',
  height: 150,
  borderRadius: 10,
  marginBottom: 10,
},
});