import React, {useState, useEffect, useContext} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {fetchUserDetailsById} from '../../hooks/customer/useReservationActions';
import {removeMemberFromGroup} from '@services/chat/chatService';
import GroupAddFriendModal from './GroupAddFriendModal';
import {useUserProfileData} from '@hooks';
import AuthContext from '@contexts/AuthContext';

const GroupInfoModal = ({isVisible, onClose, groupData, onMemberChange}) => {
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allMembers, setAllMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const {currentUserId} = useContext(AuthContext);
  const userId = currentUserId;
  const {friends, loading} = useUserProfileData(userId);

  // In GroupInfoModal component
  useEffect(() => {
    const fetchUpdatedMembersDetails = async () => {
      const membersDetailsPromise = groupData.members.map(memberId =>
        fetchUserDetailsById(memberId),
      );
      const membersDetails = await Promise.all(membersDetailsPromise);
      setAllMembers(membersDetails);
      setFilteredMembers(membersDetails);
    };

    fetchUpdatedMembersDetails();
  }, [groupData.members]); 

  useEffect(() => {
    if (!searchQuery) {
      setFilteredMembers(allMembers);
    } else {
      const filtered = allMembers.filter(member =>
        member.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery]);

  const handleMemberAdded = (newMemberId) => {
    const updatedMembers = [...groupData.members, newMemberId];
    onMemberChange(updatedMembers);
  };

  const handleOpenFriendSelection = () => {
    setShowAddFriendModal(true);
  };

  const handleRemoveFriend = async memberId => {
    try {
      await removeMemberFromGroup(groupData.id, memberId);
      Alert.alert('Success', 'Friend removed from the group!');

      // Update the local state to reflect the change
      const updatedMembers = allMembers.filter(
        member => member.userId !== memberId,
      );
      setAllMembers(updatedMembers);
      setFilteredMembers(updatedMembers);

      // Call the onMemberChange prop to update the parent component's state
      onMemberChange(updatedMembers.map(member => member.userId));
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not remove friend from the group.');
    }
  };

  // alert to ask if the user is sure they want to leave the group
  const handleLeaveGroup = async () => {
    Alert.alert('Leave Group', 'Are you sure you want to leave the group?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      // Example adjustment for handleLeaveGroup
      {text: 'Leave', onPress: () => handleRemoveFriend(currentUserId)},
    ]);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Group Info Display */}
          <Image style={styles.groupPhoto} source={{uri: groupData.photoUrl}} />
          <Text style={styles.modalText}>{groupData.name}</Text>
          <Text style={styles.modalText}>
            {groupData.members.length} members
          </Text>

          {/* Action Buttons */}
          <Button title="Add Friend" onPress={handleOpenFriendSelection} />

          {/* Search Bar */}
          <TextInput
            style={styles.searchBar}
            onChangeText={setSearchQuery}
            value={searchQuery}
            placeholder="Search member..."
          />

          {/* Members List */}
          <FlatList
            data={filteredMembers}
            keyExtractor={item => item.userId}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.friendItem,
                  selectedFriend === item && styles.selectedFriendItem,
                ]}
                onPress={() => setSelectedFriend(item)}>
                <Image
                  source={{uri: item.photoUrl}}
                  style={styles.friendImage}
                />
                <View style={styles.friendDetails}>
                  <Text style={styles.friendName}>{item.displayName}</Text>
                  <Text style={styles.friendUsername}>{item.username}</Text>
                </View>
                <Button
                  title="Remove"
                  onPress={() => handleRemoveFriend(item.userId)}
                />
              </TouchableOpacity>
            )}
          />

          {/* Action Buttons */}
          <Button title="Leave Group" onPress={handleLeaveGroup} />

          {/* Close Modal */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              onClose();
              setSearchQuery('');
              setSelectedFriend(null);
            }}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
      <GroupAddFriendModal
        visible={showAddFriendModal}
        onClose={() => setShowAddFriendModal(false)}
        friends={friends}
        groupData={groupData}
        onMemberAdded={handleMemberAdded}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  friendDetails: {
    flex: 1,
    marginLeft: 10,
  },
  friendName: {
    fontWeight: 'bold',
  },
  friendUsername: {
    color: '#666',
  },
  selectedFriendItem: {
    backgroundColor: '#f0f0f0',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  groupPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },
});

export default GroupInfoModal;
