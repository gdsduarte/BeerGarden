import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Switch } from 'react-native';

const NotificationSettingsModal = ({ isVisible, closeModal }) => {
  const [notificationSettings, setNotificationSettings] = useState({
    all: false,
    messages: false,
    friends: false,
    // Add more notification settings here
  });

  const toggleSwitch = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
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
          <Text style={styles.modalTitle}>Notification Settings</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.modalText}>All Notifications</Text>
            <Switch
              value={notificationSettings.all}
              onValueChange={() => toggleSwitch('all')}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.modalText}>Messages</Text>
            <Switch
              value={notificationSettings.messages}
              onValueChange={() => toggleSwitch('messages')}
            />
          </View>
          {/* Add more notification settings switches here */}
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
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

export default NotificationSettingsModal;
