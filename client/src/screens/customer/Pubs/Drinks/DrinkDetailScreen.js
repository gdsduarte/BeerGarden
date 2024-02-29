import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';

const DrinkDetailScreen = ({item, navigation}) => {
  useEffect(() => {
    if (item && navigation) {
      navigation.setOptions({headerTitle: item.name});
    }
  }, [item, navigation]);

  return (
    <ScrollView style={styles.container}>
      <Image source={{uri: item.image}} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>£{item.price}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f1e7',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DrinkDetailScreen;
