import React, {useState} from 'react';
import {View, Text, TextInput, Button, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import authService from '../../services/authService';
import firestoreService from '../../services/firestoreService';
import styles from '../../styles/loginScreenStyles';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    authService
      .signIn(email, password)
      .then(async response => {
        if (response && response.user) {
          const uid = response.user.uid;
          const isEmailVerified = response.user.emailVerified;

          if (!isEmailVerified) {
            alert('Please verify your email before signing in.');
            return;
          }

          try {
            const user = await firestoreService.getUser(uid);
            if (user) {
              navigation.navigate('Home', {user});
            } else {
              console.error(response);
              alert('User does not exist.');
            }
          } catch (error) {
            alert(error);
          }
        } else {
          alert('Error: User sign-in failed.');
        }
      })
      .catch(error => {
        alert(error);
      });
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

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ForgotPassword');
        }}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SignUp');
        }}>
        <Text style={styles.linkText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
