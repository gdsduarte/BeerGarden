import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputValidation = ({ type, value, onChange, style, placeholder, shouldValidate }) => {
  const [validationMessage, setValidationMessage] = useState('');

  const validateInput = () => {
    if (!shouldValidate || !value || value.trim() === '') {
      setValidationMessage('');
      return;
    }

    switch (type) {
      case 'name':
        if (!value.trim()) {
          setValidationMessage('Name cannot be empty');
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          setValidationMessage('Only letters and spaces are allowed');
        } else {
          setValidationMessage('');
        }
        break;

      case 'email':
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(value)) {
          setValidationMessage('Invalid email format');
        } else {
          setValidationMessage('');
        }
        break;

      case 'password':
        if (value.length < 6) {
          setValidationMessage('Password is too short');
        } else if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value)) {
          setValidationMessage('Need an uppercase, lowercase, and numbers');
        } else {
          setValidationMessage('Strong password');
        }
        break;

      default:
        setValidationMessage('');
        break;
    }
  };

  useEffect(() => {
    validateInput();
  }, [value, shouldValidate]);

  return (
    <View style={{ position: 'relative'}}>
      <TextInput 
        style={[style, validationMessage ? styles.inputError : null]} 
        type={type}
        placeholder={placeholder}
        value={value} 
        onChangeText={onChange}
        secureTextEntry={type === 'password'} 
      />
      {validationMessage && (
        <Text style={styles.errorMessage}>
          {validationMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputError: {
    borderColor: 'red',
  },
  errorMessage: {
    position: 'absolute',
    top: 5,
    right: 10,
    color: 'red',
    fontSize: 10,
  },
});

export default InputValidation;
