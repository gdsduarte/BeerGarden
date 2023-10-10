import React from 'react';
import { View, Text, StyleSheet, Button  } from 'react-native';
import authService from '../services/authService';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
 
  const handleLogout = () => {
    authService.signOut();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Name: John Doe</Text>
        <Text style={styles.infoText}>Email: john.doe@example.com</Text>
        <Text style={styles.infoText}>Phone: 123-456-7890</Text>
      </View>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ProfileScreen;
