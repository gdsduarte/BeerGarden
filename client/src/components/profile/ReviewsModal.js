/**
 * ReviewsModal component is modal that displays a list of reviews, places, or friends.
 */

import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';

const ReviewsModal = ({
  isModalVisible,
  setModalVisible,
  modalData,
  modalDataType,
  renderPlacesItem,
  renderFriendsItem,
  renderReviewsItem,
}) => {
  const [modalSearchText, setModalSearchText] = useState('');
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isModalVisible}
      onRequestClose={() => {
        setModalVisible(!isModalVisible);
      }}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            value={modalSearchText}
            onChangeText={text => setModalSearchText(text)}
          />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={modalData.filter(item =>
              item.displayName
                .toLowerCase()
                .includes(modalSearchText.toLowerCase()),
            )}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              switch (modalDataType) {
                case 'places':
                  return renderPlacesItem({item, inModal: true});
                case 'friends':
                  return renderFriendsItem({item, inModal: true});
                case 'reviews':
                  return renderReviewsItem({item, inModal: true});
                default:
                  return <Text>Unknown item type</Text>;
              }
            }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(!isModalVisible)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '90%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#355E3B',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  searchBar: {
    width: '70%',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
  },
});

export default ReviewsModal;
