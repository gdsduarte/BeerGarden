import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const PrivacyPolicyModal = ({ closeModal }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Privacy Policy</Text>
      <ScrollView style={styles.content}>
        <Text style={styles.text}>
          {/* Your privacy policy content here */}
          Your privacy is important to us. This privacy policy outlines how we collect, use, and protect your information.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#ccc',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default PrivacyPolicyModal;
