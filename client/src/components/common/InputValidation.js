/**
 * InputValidation component is a reusable component that validates user input based on the type of input.
 * It displays an error message if the input is invalid.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputValidation = ({ type, value, onChange, style, placeholder, passwordValue }) => {
  const [validationMessage, setValidationMessage] = useState('');

  const validateInput = () => {
    // Maximum character length for each input type
    const maxLength = {
      name: 35,
      username: 10,
      email: 35,
      phone: 15,
    };
  
    // Check for empty input
    if (!value || value.trim() === '') {
      setValidationMessage('');
      return;
    }
  
    // Check for character limit
    if (maxLength[type] && value.length > maxLength[type]) {
      setValidationMessage(`Maximum ${maxLength[type]} characters allowed`);
      return;
    }

    // Check for valid input based on type 
    switch (type) {
      case 'name':
        if (!value.trim()) {
          setValidationMessage('Cannot be empty');
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          setValidationMessage('Only letters and spaces are allowed');
        } else {
          setValidationMessage('');
        }
        break;

      case 'username':
        if (!value.trim()) {
          setValidationMessage('Cannot be empty');
        } else if (!/^[a-zA-Z0-9]*$/.test(value)) {
          setValidationMessage('Only letters and numbers are allowed');
        } else {
          setValidationMessage('');
        }
        break;

      case 'email':
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!value.trim()) {
          setValidationMessage('Cannot be empty');
        } else if (!emailRegex.test(value)) {
          setValidationMessage('Invalid email format');
        } else {
          setValidationMessage('');
        }
        break;

      case 'phone':
        const phoneRegex = /^\d+$/;
        if (!value.trim()) {
          setValidationMessage('Cannot be empty');
        } else if (!phoneRegex.test(value)) {
          setValidationMessage('Invalid phone number');
        } else {
          setValidationMessage('');
        }
        break;

      case 'password':
        let passwordMessage = '';
        if (!value.trim()) {
            setValidationMessage('Cannot be empty');
        } else if (value.includes(' ')) {
            setValidationMessage('Password cannot contain spaces');
            return;
        } else if (value.length < 6) {
            passwordMessage = 'Password is too short';
        } else {
            let hasNumber = false;
            let hasLowercase = false;
            let hasUppercase = false;
            for (let i = 0; i < value.length; i++) {
                const char = value.charAt(i);
                if (/[0-9]/.test(char)) {
                    hasNumber = true;
                } else if (/[a-z]/.test(char)) {
                    hasLowercase = true;
                } else if (/[A-Z]/.test(char)) {
                    hasUppercase = true;
                }
            }
            if (!hasNumber) {
                passwordMessage += 'At least one number. ';
            }
            if (!hasLowercase) {
                passwordMessage += 'At least one lowercase letter. ';
            }
            if (!hasUppercase) {
                passwordMessage += 'At least one uppercase letter. ';
            }
            if (passwordMessage === '') {
                setValidationMessage('');
                return;
            }
        }
        setValidationMessage(passwordMessage);
        break;
      
      case 'confirmPassword':
        if (!value.trim()) {
          setValidationMessage('Cannot be empty');
        } else if (value !== passwordValue) {
          setValidationMessage('Passwords do not match');
        } else {
          setValidationMessage('');
        }
        break;

      default:
        setValidationMessage('');
        break;
    }
  };

  useEffect(() => {
    validateInput();
  }, [value]);

  return (
    <View style={{ position: 'relative'}}>
      <TextInput 
        style={[style, validationMessage ? styles.inputError : null]} 
        type={type}
        placeholder={placeholder}
        value={value} 
        onChangeText={onChange}
        secureTextEntry={type === 'password' || type === 'confirmPassword'} 
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
