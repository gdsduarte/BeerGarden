import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

const AboutModal = ({ closeModal }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Version:</Text>
        <Text style={styles.value}>1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Contact:</Text>
        <Text style={styles.value}>Phone: +1 123 456 7890</Text>
        <Text style={styles.value}>Email: support@example.com</Text>
        <Text style={styles.value}>Website: www.example.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Social Media:</Text>
        <Text style={styles.value}>Facebook: @example</Text>
        <Text style={styles.value}>Twitter: @example</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openURL('mailto:support@example.com')}
      >
        <Text style={styles.buttonText}>Report a Problem</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default AboutModal;
