import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

const HomeScreen = () => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Beer Garden!</Text>
      <Text style={styles.subtitle}>Explore our selection of beers and find your new favorite.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default HomeScreen;
