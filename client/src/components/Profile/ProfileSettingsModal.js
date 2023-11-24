import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const ProfileSettingsModal = ({ isVisible, closeModal }) => {
  const [selectedSetting, setSelectedSetting] = useState(null);

  const handleSettingClick = (setting) => {
    setSelectedSetting(setting);
    // Navigate to the specific setting screen or perform the setting action
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Profile Settings</Text>
          <TouchableOpacity onPress={() => handleSettingClick('avatar')}>
            <Text style={styles.modalText}>Change Avatar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSettingClick('name')}>
            <Text style={styles.modalText}>Change Name</Text>
          </TouchableOpacity>
          {/* Add more settings options here */}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileSettingsModal;
