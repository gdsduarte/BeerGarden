import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import authService from '../../services/authService';
import firestoreService from '../../services/firestoreService';
import styles from '../../styles/signUpScreenStyles';
import InputValidation from '../../components/common/InputValidation';

const UserSignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [shouldValidate, setShouldValidate] = useState(false);

  const handleSignUp = async () => {
    setShouldValidate(true);
    
    const usernameExists = await firestoreService.checkUsernameExists(username);
    if (usernameExists) {
      alert("Username is already taken. Please choose a different one.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    if (!validationMessage) {
  
      try {
        const userCredential = await authService.signUp(email, password);
        if (userCredential && userCredential.user) {
          const { user } = userCredential;
          const userForFirestore = {
            email: user.email,
            username: username,
            name: name,
            userUID: user.uid,
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
        shouldValidate={shouldValidate}
      />
      <InputValidation
        style={styles.input}
        type="username"
        placeholder="Username"
        value={username}
        onChange={(text) => setUsername(text)}
      />
      <InputValidation
        style={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(text) => setEmail(text)}
        shouldValidate={shouldValidate}
      />
      <InputValidation
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(text) => setPassword(text)}
        shouldValidate={shouldValidate}
      />
      <InputValidation
        style={styles.input}
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(text) => setConfirmPassword(text)}
        shouldValidate={shouldValidate}
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
