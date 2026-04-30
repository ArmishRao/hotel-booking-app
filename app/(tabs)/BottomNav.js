import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function BottomNav() {
  const [active, setActive] = useState('Home');

  return (
    <View style={styles.container}>

      {/* HOME (ACTIVE PILL) */}
      <TouchableOpacity
        style={[
          styles.itemActive,
          active === 'Home' && styles.activeBg
        ]}
        onPress={() => setActive('Home')}
      >
        <Icon name="home" size={20} color="#000" />
        <Text style={styles.activeText}>Home</Text>
      </TouchableOpacity>

      {/* SEARCH */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => setActive('Search')}
      >
        <Icon name="search" size={20} color="#777" />
      </TouchableOpacity>

      {/* CHAT */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => setActive('Chat')}
      >
        <Icon name="message-square" size={20} color="#777" />
      </TouchableOpacity>

      {/* PROFILE */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => setActive('Profile')}
      >
        <Icon name="user" size={20} color="#777" />
      </TouchableOpacity>

    </View>
  );
}