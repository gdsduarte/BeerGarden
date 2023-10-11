import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import authService from '../services/authService';
import firestoreService from '../services/firestoreService';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    
    authService
      .signIn(email, password)
      .then(async (response) => {
        if (response && response.user) {
          const uid = response.user.uid;
          try {
            const user = await firestoreService.getUser(uid);
            if (user) {
              navigation.navigate('Home', { user });
            } else {
              console.error(response);
              alert("User does not exist.");
            }
          } catch (error) {
            alert(error);
          }
        } else {
          alert("Error: User sign-in failed.");
        }
      })
      .catch(error => {
        alert(error);
      });
  };

  const handleGoogleLogin = async () => {
    // handle Google login logic here
    /* try {
      await authService.signInWithGoogle();
      navigation.navigate('Home');
    } catch (error) {
      console.error("Error logging in with Google:", error.message);
      // You can also show an alert or any other UI feedback for the error
    } */
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />
      <Button title="Login with Google" onPress={handleGoogleLogin} />

      <TouchableOpacity onPress={() => {navigation.navigate('ForgotPassword')}}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {navigation.navigate('SignUp')}}>
        <Text style={styles.linkText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  linkText: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center',
  },
});

export default LoginScreen;
