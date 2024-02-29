import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import authService from '../../../../services/authService';
import firestoreService from '../../../../services/firestoreService';
import styles from '../../../../styles/signUpScreenStyles';
import InputValidation from '../../../../components/common/InputValidation';

const OwnerSignUpScreen = ({ navigation }) => {
  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation states
  const [nameValidation, setNameValidation] = useState('');
  const [emailValidation, setEmailValidation] = useState('');
  const [phoneValidation, setPhoneValidation] = useState('');
  const [passwordValidation, setPasswordValidation] = useState('');
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState('');
  const [shouldFlagEmpty, setShouldFlagEmpty] = useState(false);

  const handleSignUp = async () => {
    setShouldFlagEmpty(true);

    // Check for validation messages or empty fields
    if (!(nameValidation || emailValidation || phoneValidation || passwordValidation || confirmPasswordValidation)) {
      alert("Please correct the errors before submitting.");
      return;
    }

    // Firebase logic
    try {
      // Create user
      const userCredential = await authService.signUp(email, password);
      // Add user to firestore
      if (userCredential && userCredential.user) {
        const { user } = userCredential;
        const userForFirestore = {
          displayName: name,
          email: user.email,
          phone: phone,
          addresses: addresses,
          uid: user.uid,
          role: 'owner',
        };
        await firestoreService.addUser(user.uid, userForFirestore);
        alert("User registered successfully, please confirm your email address.");
        user.sendEmailVerification();
        navigation.navigate('Login');
      } else {
        alert("Error: User registration failed.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business Account</Text>
      <InputValidation
        style={styles.input}
        type="name"
        placeholder="Business Name"
        value={name}
        onChange={(text) => setName(text)}
        onValidation={(message) => setNameValidation(message)}
        shouldFlagEmpty={shouldFlagEmpty}
      />
      <InputValidation
        style={styles.input}
        type="email"
        placeholder="Business Email"
        value={email}
        onChange={(text) => setEmail(text)}
        onValidation={(message) => setEmailValidation(message)}
        shouldFlagEmpty={shouldFlagEmpty}
      />
      <InputValidation
        style={styles.input}
        type="phone"
        placeholder="Phone"
        value={phone}
        onChange={(text) => setPhone(text)}
        onValidation={(message) => setPhoneValidation(message)}
        shouldFlagEmpty={shouldFlagEmpty}
      />
      <InputValidation
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(text) => setPassword(text)}
        onValidation={(message) => setPasswordValidation(message)}
        shouldFlagEmpty={shouldFlagEmpty}
      />
      <InputValidation
        style={styles.input}
        type="confirmPassword"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(text) => setConfirmPassword(text)}
        passwordValue={password}
        onValidation={(message) => setConfirmPasswordValidation(message)}
        shouldFlagEmpty={shouldFlagEmpty}
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

export default OwnerSignUpScreen;
