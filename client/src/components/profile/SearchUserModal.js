/**
 * SearchUserModal is a modal component that allows users to search for other users by username.
 */

import React, {useState} from 'react';
import {
  Modal,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import {useUsers} from '@hooks';

const SearchUserModal = ({
  isSearchModalVisible,
  setSearchModalVisible,
  navigateToUserProfile,
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const {searchUsers} = useUsers();

  const handleSearch = () => {
    if (!searchText.trim()) return;
    const results = searchUsers(searchText);
    setSearchResults(results);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isSearchModalVisible}
      onRequestClose={() => setSearchModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search users..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />
          <FlatList
            data={searchResults}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => {
                  setSearchModalVisible(false);
                  navigateToUserProfile(item.id);
                }}>
                <Image style={styles.userImage} source={{uri: item.photoUrl}} />
                <View>
                  <Text style={styles.userDisplayName}>{item.displayName}</Text>
                  <Text style={styles.userName}>@{item.username}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setSearchModalVisible(false);
              setSearchText('');
              setSearchResults([]);
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
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  searchBar: {
    width: '70%',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeButtonText: {
    color: '#355E3B',
    fontWeight: 'bold',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userDisplayName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 14,
    color: '#666',
  },
});

export default SearchUserModal;
