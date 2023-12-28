import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BaseModal = ({ isVisible, title, content, actions }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalContent}>{content}</Text>
          <View style={styles.actionContainer}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionButton, action.style]}
                onPress={action.onPress}
              >
                <Text style={styles.actionText}>{action.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    marginBottom: 15,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 15,
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 5,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BaseModal;
