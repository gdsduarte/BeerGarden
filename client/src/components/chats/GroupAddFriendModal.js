/**
 * GroupAddFriendModal is a modal component that allows users to add friends to a group chat.
 * 
 * It contains the following features:
 * - The user can search for friends to add to the group, and the friends are displayed in a list.
 * - The user can select friends to add to the group by clicking on the friend's name.
 * - The user can add the selected friends to the group by clicking the "Add Friends" button.
 * - The user can close the modal by clicking the "Close" button.
 * - The modal is displayed when the user clicks on the "Add Friend" button in the GroupInfoModal.
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
  Button,
  Alert,
} from 'react-native';
import {addMemberToGroup} from '@services/chat/chatService';

const GroupAddFriendModal = ({
  visible,
  onClose,
  friends,
  groupData,
  onMemberAdded,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);

  // Filter out friends who are in the group
  const availableFriends = friends.filter(
    friend => !groupData.members.includes(friend.id),
  );

  // State to hold the filtered list of friends based on search query and membership
  const [filteredFriends, setFilteredFriends] = useState(availableFriends);

  // Filter out friends who are in the group
  useEffect(() => {
    const availableFriends = friends.filter(
      friend => !groupData.members.includes(friend.userId),
    );
    setFilteredFriends(availableFriends);
  }, [friends, groupData.members]);

  // Filter friends based on search query
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const filtered = availableFriends.filter(friend =>
        friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredFriends(filtered);
    } else {
      setFilteredFriends(friends);
    }
  }, [searchQuery, friends, availableFriends]);

  // Toggle friend selection when the user taps on a friend
  const toggleFriendSelection = friend => {
    if (selectedFriends.includes(friend.id)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friend.id));
    } else {
      setSelectedFriends([...selectedFriends, friend.id]);
    }
  };

  // Add selected friends to the group
  const handleAddFriendsToGroup = () => {
    selectedFriends.forEach(friendId => {
      handleAddSelectedFriend(friendId);
    });
  };

  // Add a friend to the database and update the UI
  const handleAddSelectedFriend = async selectedFriendId => {
    try {
      await addMemberToGroup(groupData.id, selectedFriendId);
      Alert.alert('Friend added to group');
      onMemberAdded(selectedFriendId);
    } catch (error) {
      console.error('Failed to add friend:', error);
    }
    onClose();
    setSearchQuery('');
    setSelectedFriends([]);
  };

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
            renderItem={({item}) => {
              const isAdded = groupData.members.includes(item.id);
              return (
                <TouchableOpacity
                  style={[
                    styles.friendItem,
                    selectedFriends.includes(item.id) &&
                      styles.selectedFriendItem,
                    isAdded && styles.friendAlreadyAdded,
                  ]}
                  onPress={() => !isAdded && toggleFriendSelection(item)}
                  disabled={isAdded}>
                  <Text style={{color: isAdded ? '#A0A0A0' : '#000'}}>
                    {item.displayName}
                  </Text>
                  {isAdded && (
                    <Text style={styles.alreadyAddedText}>
                      Already in Group
                    </Text>
                  )}
                </TouchableOpacity>
              );
            }}
          />
          <Button title="Add Friends" onPress={handleAddFriendsToGroup} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              onClose();
              setSearchQuery('');
              setSelectedFriends([]);
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
  friendAlreadyAdded: {
    backgroundColor: '#e0e0e0',
  },
  alreadyAddedText: {
    color: '#a0a0a0',
    fontStyle: 'italic',
  },
});

export default GroupAddFriendModal;
