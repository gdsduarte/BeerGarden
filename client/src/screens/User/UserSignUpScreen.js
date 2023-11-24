import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import authService from '../../services/authService';
import firestoreService from '../../services/firestoreService';
import styles from '../../styles/signUpScreenStyles';
import InputValidation from '../../components/common/InputValidation';

const UserSignUpScreen = ({ navigation }) => {
  // Input states
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation states
  const [nameValidation, setNameValidation] = useState('');
  const [usernameValidation, setUsernameValidation] = useState('');
  const [emailValidation, setEmailValidation] = useState('');
  const [passwordValidation, setPasswordValidation] = useState('');
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState('');
  const [shouldFlagEmpty, setShouldFlagEmpty] = useState(false);

  const handleSignUp = async () => {
    setShouldFlagEmpty(true);
    
    // Check if username is taken
    const usernameExists = await firestoreService.checkUsernameExists(username);
    if (usernameExists) {
      alert("Username is already taken.");
      return;
    }

    // Check if email is taken
    const emailExists = await firestoreService.checkEmailExists(email);
    if (emailExists) {
      alert("Email is already registered.");
      return;
    }

    // Check for validation messages
    if (!(nameValidation || usernameValidation || emailValidation || passwordValidation || confirmPasswordValidation)) {
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
          name: name,
          username: username,
          email: user.email,
          userUID: user.uid,
          role: 'user',
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
      <Text style={styles.title}>Personal Account</Text>
      <InputValidation
        style={styles.input}
        type="name"
        placeholder="Name"
        value={name}
        onChange={(text) => setName(text)}
        onValidation={(message) => setNameValidation(message)}
        shouldFlagEmpty={shouldFlagEmpty}
      />
      <InputValidation
        style={styles.input}
        type="username"
        placeholder="Username"
        value={username}
        onChange={(text) => setUsername(text)}
        onValidation={(message) => setUsernameValidation(message)}
        shouldFlagEmpty={shouldFlagEmpty}
      />
      <InputValidation
        style={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(text) => setEmail(text)}
        onValidation={(message) => setEmailValidation(message)}
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

export default UserSignUpScreen;
