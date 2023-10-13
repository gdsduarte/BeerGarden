import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import styles from '../styles/SignupSelectionScreenStyles';

const SignupSelectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join the BeerGarden community as:</Text>
      
      <Button title="Bussiness Account" 
        onPress={() => {
          alert('To fully register your pub, verification will be required after registration.');
          navigation.navigate('OwnerSignUpScreen');
        }} 
      />
  
      <Button title="Personal Account" 
        onPress={() => navigation.navigate('UserSignUpScreen')} 
      />

      <TouchableOpacity style={styles.button} 
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupSelectionScreen;

