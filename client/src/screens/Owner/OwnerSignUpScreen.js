import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import authService from '../../services/authService';
import firestoreService from '../../services/firestoreService';
import styles from '../../styles/signUpScreenStyles';
import InputValidationComponent from '../../components/common/InputValidation';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
  
    try {
      const userCredential = await authService.signUp(email, password);
      if (userCredential && userCredential.user) {
        const { user } = userCredential;
        const userForFirestore = {
          name: name,
          email: user.email,
          phone: phone,
          userUID: user.uid,
        };
        await firestoreService.addUser(user.uid, userForFirestore);
        alert("User registered successfully, please confirm your email address.");
        navigation.navigate('Login');
      } else {
        alert("Error: User registration failed.");
      }
    } catch (error) {
      alert(error.message);
    }
    
    user.sendEmailVerification();

  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bussiness Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Business Name"
        value={name}
        onChangeText={(text) => setName(text)}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Business Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={(text) => setPhone(text)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
