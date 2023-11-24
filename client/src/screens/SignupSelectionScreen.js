import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import styles from '../styles/SignupSelectionScreenStyles';
import { navigateWithAlert } from '../utils/navigationHelper';

const SignupSelectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join the BeerGarden community as:</Text>
      
      <Button title="Business Account" 
        onPress={() => {
          navigateWithAlert(
            navigation, 
            'OwnerSignUpScreen', 
            'To fully register your bussiness, verification will be required after registration.'
          );
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

