import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

const Card = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
    <Image source={{ uri: item.image }} style={styles.cardImage} />
    <Text style={styles.cardText}>{item.name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  cardText: {
    marginTop: 5,
    fontWeight: 'bold',
  },
});

export default Card;
