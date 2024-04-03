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
      <View style={styles.modalContent}>
        <View>
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
        </View>
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setModalVisible(!isModalVisible)}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  closeButtonText: {
    color: '#355E3B',
    fontWeight: 'bold',
  },
});

export default ReviewsModal;
