import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const LogoutModal = ({ closeModal, handleLogout }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Logout</Text>
      <Text style={styles.text}>Are you sure you want to logout?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF5733',
    padding: 15,
    borderRadius: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default LogoutModal;


/* import React, { useState } from 'react';
import BaseModal from '../common/BaseModal';

const LogoutModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  const actions = [
    {
      text: 'Cancel',
      onPress: () => setIsVisible(false),
      style: { backgroundColor: 'red' },
    },
    {
      text: 'Confirm',
      onPress: () => {
        // Handle logout logic here
        setIsVisible(false);
      },
    },
  ];

  return (
    <BaseModal
      isVisible={isVisible}
      title="Logout"
      content="Are you sure you want to logout?"
      actions={actions}
    />
  );
};

export default LogoutModal; */
