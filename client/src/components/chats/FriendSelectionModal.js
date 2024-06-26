/**
 * FriendSelectionModal component is a modal that allows the user to select a friend to chat with.
 * 
 * It contains the following features:
 * - The user can search for friends to chat with, and the friends are displayed in a list.
 * - The user can select friends to chat with by clicking on the friend's name.
 * - The user can close the modal by clicking the "Close" button.
 * - The modal is displayed when the user clicks on the "New Chat" button in the Chats screen.
 * - The user can search for friends by typing in the search bar.
 */

import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const FriendSelectionModal = ({visible, onClose, friends, userId}) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFriends, setFilteredFriends] = useState(friends);

  // Filter friends based on the search query
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const filtered = friends.filter(friend =>
        friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredFriends(filtered);
    } else {
      setFilteredFriends(friends);
    }
  }, [searchQuery, friends]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search for friends..."
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
          <FlatList
            data={filteredFriends}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.friendItem}
                onPress={() => {
                  navigation.navigate('SpecificChat', {
                    currentUserId: userId,
                    targetUserId: item.userId,
                  });
                  console.log('Current user ID:', userId);
                  console.log('Target user ID:', item.userId);
                  onClose();
                }}>
                <Text>{item.displayName}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              onClose();
              setSearchQuery('');
            }}>
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
  friendItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedFriendItem: {
    backgroundColor: '#f0f0f0',
  },
  input: {
    width: '70%',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
  },
});

export default FriendSelectionModal;
