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

  useEffect(() => {
    // Filter friends based on the search query
    if (searchQuery.trim() !== '') {
      const filtered = friends.filter(friend =>
        friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredFriends(filtered);
    } else {
      setFilteredFriends(friends);
    }
  }, [searchQuery, friends]);

  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setGroupPhoto(response.assets[0].uri);
      }
    });
  };

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
        // Handle case where chatId is null, meaning group creation failed
        console.error('Group creation failed.');
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const addFriendToGroup = friendId => {
    if (!selectedFriends.includes(friendId)) {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

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
              style={{width: 100, height: 100}}
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
});

export default CreateGroupModal;
