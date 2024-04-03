/**
 * CreateGroupModal component is a modal that allows the user to create a new group chat.
 * 
 * It contains the following features:
 * - The user can select a group name, a group photo, and add friends to the group.
 * - The user can search for friends to add to the group, and the friends are displayed in a list.
 * - The user can select friends to add to the group by clicking on the friend's name.
 * - The user can select multiple friends to add to the group by clicking on the friend's name.
 * - The user can also remove friends from the group by clicking on the friend's name again.
 * - The user can create the group by clicking the "Create Group" button.
 * - The user can close the modal by clicking the "Close" button.
 * - The user can also select a photo for the group by clicking the "Select a Photo" text.
 */

import React, {useState, useContext, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import AuthContext from '@contexts/AuthContext';
import {createGroup} from '@services/chat/chatService';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {uploadPhotoToFirebaseStorage} from '@services/storageService';

const CreateGroupModal = ({visible, onClose, friends}) => {
  const navigation = useNavigation();
  const {currentUserId} = useContext(AuthContext);
  const [groupName, setGroupName] = useState('');
  const [groupPhoto, setGroupPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
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

  // Handle choosing a photo from the device
  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setGroupPhoto(response.assets[0].uri);
      }
    });
  };

  // Handle creating a group
  const handleCreateGroup = async () => {
    if (groupName.trim() === '' || selectedFriends.length === 0) {
      Alert.alert(
        'Invalid Group',
        'Please provide a group name and select friends to add',
      );
      return;
    }

    // Only proceed with photo upload if a photo was selected
    let uploadedPhotoUrl = null;
    if (groupPhoto) {
      uploadedPhotoUrl = await uploadPhotoToFirebaseStorage(groupPhoto);
      if (!uploadedPhotoUrl) {
        Alert.alert(
          'Upload Failed',
          'Failed to upload group photo. Please try again.',
        );
        return;
      }
    }

    // Construct the group data
    const groupData = {
      name: groupName,
      members: [currentUserId, ...selectedFriends],
      createdBy: currentUserId,
      photoUrl: uploadedPhotoUrl,
      type: 'group',
    };

    // Save the group data to the database
    try {
      const chatId = await createGroup(currentUserId, null, groupData);
      if (chatId) {
        setGroupName('');
        setGroupPhoto(null);
        setSelectedFriends([]);
        onClose();
        navigation.navigate('SpecificChat', {
          chatId,
          currentUserId,
          chatType: 'group',
        });
      } else {
        console.error('Group creation failed.');
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  // Add a friend to the selected friends list
  const addFriendToGroup = friendId => {
    if (!selectedFriends.includes(friendId)) {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  // Remove a friend from the selected friends list
  const removeFriendFromGroup = friendId => {
    setSelectedFriends(selectedFriends.filter(id => id !== friendId));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleChoosePhoto}>
            <Text>Select a Photo</Text>
          </TouchableOpacity>
          {groupPhoto && (
            <Image
              source={{uri: groupPhoto}}
              style={styles.image}
            />
          )}
          <TextInput
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Group Name"
            style={styles.input}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Search for friends..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            autoFocus={true}
          />
          <FlatList
            data={filteredFriends}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.friendItem,
                  selectedFriends.includes(item.userId)
                    ? styles.selectedFriendItem
                    : null,
                ]}
                onPress={() => {
                  if (selectedFriends.includes(item.userId)) {
                    removeFriendFromGroup(item.userId);
                  } else {
                    addFriendToGroup(item.userId);
                  }
                }}>
                <Text>{item.displayName}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Create Group" onPress={handleCreateGroup} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setGroupName('');
              setSelectedFriends([]);
              setGroupPhoto(null);
              onClose();
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
  friendItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
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
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default CreateGroupModal;
