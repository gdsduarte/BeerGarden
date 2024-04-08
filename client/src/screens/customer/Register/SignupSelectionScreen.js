/**
 * Note: This file is NOT used in the project. It is for feature implementations!!
 *
 * This screen is the first screen that the user sees when they are not logged in and they want to sign up.
 * The user can choose between a business account or a personal account.
 * The user can also navigate back to the login screen.
 */

import React from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet} from 'react-native';
import {navigateWithAlert} from '@utils/navigationHelper';

const SignupSelectionScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join the BeerGarden community as:</Text>

      <Button
        title="Business Account"
        onPress={() => {
          navigateWithAlert(
            navigation,
            'OwnerSignUpScreen',
            'To fully register your bussiness, verification will be required after registration.',
          );
        }}
      />

      <Button
        title="Personal Account"
        onPress={() => navigation.navigate('UserSignUpScreen')}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default SignupSelectionScreen;
