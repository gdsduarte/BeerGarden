/**
 * This component is used to display the details of a reservation.
 * It allows the user to view and edit the details of the reservation.
 * The user can view the list of invited friends and remove them.
 * The user can invite friends to the reservation and leave the reservation.
 * The user can view the QR code for the reservation.
 * The user can navigate to the pub details screen and start a chat with the pub.
 */

import React, {useState, useCallback, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {format} from 'date-fns';
import {useFocusEffect} from '@react-navigation/native';
import {
  updateReservation,
  deleteReservation,
  fetchUserDetailsById,
} from '../../../hooks/customer/useReservationActions';
import {useUserProfileData} from '@hooks';
import AuthContext from '@contexts/AuthContext';
import Loading from '@components/common/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';

const ReservationDetailsScreen = ({route, navigation}) => {
  const {booking} = route.params;
  const {currentUserId} = useContext(AuthContext);
  const isArchived = booking.isBooked === true;
  const userId = booking.members.find(member => member === currentUserId);
  const pubId = booking.members.find(member => member !== userId);
  const [invitedFriends, setInvitedFriends] = useState(
    booking.members.filter(
      member => member.id !== userId && member.id !== pubId,
    ),
  );
  const {friends, loading} = useUserProfileData(userId);
  const bookingDate = booking.date.toDate
    ? booking.date.toDate()
    : new Date(booking.date);

  // Initial details
  const initialDetails = {
    name: booking.userName,
    date: format(bookingDate, 'yyyy-MM-dd'),
    time: format(bookingDate, 'HH:mm'),
    partySize: booking.partySize,
    specialRequest: booking.specialRequest,
  };

  // State to keep track of current and original details
  const [details, setDetails] = useState(initialDetails);
  const [originalDetails, setOriginalDetails] = useState(initialDetails);
  const [originalInvitedFriends, setOriginalInvitedFriends] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isNewMember, setIsNewMember] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const isInvitedFriend = booking.members.includes(userId);

  let qrCodeData = '';
  if (isInvitedFriend) {
    qrCodeData = JSON.stringify({reservationId: booking.id, userId: userId});
  }

  const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState(false);

  // Function to toggle the QR code modal
  const QRCodeModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isQRCodeModalVisible}
      onRequestClose={() => setIsQRCodeModalVisible(false)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <QRCode value={qrCodeData} size={250} />
          <TouchableOpacity
            style={[styles.buttonModal, styles.buttonClose]}
            onPress={() => setIsQRCodeModalVisible(false)}>
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  useFocusEffect(
    useCallback(() => {
      // Extract parameters from navigation
      const routeParams = route.params || {};
      const {selectedDate, selectedHour} = routeParams;

      // Check if there are new date and time from the BookingScreen
      if (selectedDate && selectedHour) {
        setDetails(prevDetails => ({
          ...prevDetails,
          date: selectedDate,
          time: selectedHour,
          fireDate: new Date(`${selectedDate}T${selectedHour}:00`),
        }));
      }
    }, [route.params]),
  );

  useEffect(() => {
    // Extract the details of the invited friends
    const fetchInvitedFriendsDetails = async () => {
      const invitedMemberIds = booking.members.filter(
        id => id !== userId && id !== pubId,
      );

      // Fetch the details of all the invited members
      const promises = invitedMemberIds.map(id => fetchUserDetailsById(id));
      const membersDetails = await Promise.all(promises);

      setInvitedFriends(membersDetails);
      setOriginalInvitedFriends(membersDetails);
    };

    fetchInvitedFriendsDetails();
  }, [booking.members, userId, pubId]);

  useEffect(() => {
    const initialInvitedFriends = friends.filter(friend =>
      booking.members.includes(friend.id),
    );
    setInvitedFriends(initialInvitedFriends);
  }, [friends, booking.members]);

  const handleEditToggle = () => {
    if (isNewMember) {
      setIsNewMember(false);
    }
    setIsEditMode(!isEditMode);
  };

  const handleFriendToggle = () => {
    if (isEditMode) {
      setIsEditMode(false);
    }
    setIsNewMember(!isNewMember);
  };

  // Function to update the reservation
  const handleSave = async () => {
    const uniqueMemberIds = Array.from(
      new Set([...booking.members, ...selectedFriends]),
    );

    const newDetails = {
      ...details,
      date: new Date(`${details.date}T${details.time}`),
      timeSlot: details.time,
      members: uniqueMemberIds,
      status: 'pending',
    };

    Alert.alert(
      'Confirm Update',
      'Are you sure you want to update this reservation?',
      [
        {
          text: 'Cancel',
          onPress: () => setIsEditMode(false),
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: async () => {
            const success = await updateReservation(booking.id, newDetails);
            if (success) {
              setSelectedFriends([]);
              setIsEditMode(false);
              setOriginalDetails(details);
              Alert.alert('Success', 'Reservation updated successfully');
            } else {
              Alert.alert('Error', 'Failed to update reservation');
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  // Function to delete the reservation
  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this reservation?',
      [
        {
          text: 'Are you sure?',
          onPress: async () => {
            const success = await deleteReservation(booking.id);
            if (success) {
              Alert.alert('Success', 'Reservation deleted successfully');
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to delete reservation');
            }
          },
        },
        {text: 'Cancel', onPress: () => {}},
      ],
    );
  };

  // Function to filter friends based on the search query
  const handleSearch = query => {
    if (query === '') {
      setFilteredFriends([]);
    } else {
      const lowercasedQuery = query.toLowerCase();
      const filtered = friends.filter(friend =>
        friend.displayName.toLowerCase().includes(lowercasedQuery),
      );
      setFilteredFriends(filtered);
    }
  };

  // Function to add a friend to the list of invited friends
  const handleInvite = friendId => {
    // Check if adding another friend would exceed the party size
    if (invitedFriends.length >= booking.partySize - 1) {
      Alert.alert(
        'Limit Reached',
        'You cannot invite more friends than the party size allows.',
      );
      return;
    }

    // Prevent adding if the friend is already invited
    if (invitedFriends.some(friend => friend.id === friendId)) {
      Alert.alert(
        'Friend already added',
        'This friend has already been invited.',
      );
      return;
    }

    setSelectedFriends(prev => {
      if (prev.includes(friendId)) {
        return prev.filter(id => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  // Function to remove a friend from the list of invited friends
  const handleRemoveFriend = friendId => {
    setInvitedFriends(currentFriends => {
      // Filter out the friend by checking both the `friendId` and `userId`
      const updatedFriends = currentFriends.filter(friend => {
        // Check if the friend object has a `friendId` field and compare it
        const idToCompare = friend.friendId || friend.userId || friend.id;
        return idToCompare !== friendId;
      });
      return updatedFriends;
    });
  };

  // Function to cancel the edit mode
  const handleCancel = () => {
    setDetails(originalDetails);
    setIsEditMode(false);
    setIsNewMember(false);
    setSearchQuery('');
    setFilteredFriends([]);
    setSelectedFriends([]);
    setInvitedFriends(originalInvitedFriends);
  };

  // Function to leave the reservation
  const handleLeaveReservation = async () => {
    Alert.alert(
      'Leave Reservation',
      'Are you sure you want to leave this reservation?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Leave',
          onPress: async () => {
            // Logic to remove the current user from the booking.members array
            const updatedMembers = booking.members.filter(
              memberId => memberId !== userId,
            );
            // Update the reservation in the database
            try {
              await updateReservation(booking.id, {members: updatedMembers});
              Alert.alert('Reservation Left', 'You have left the reservation.');
              // Navigate back
              navigation.goBack();
            } catch (error) {
              console.error('Failed to leave reservation:', error);
              Alert.alert('Error', 'Failed to leave the reservation.');
            }
          },
        },
      ],
    );
  };

  // Update the reservation in the database
  const editDateTime = () => {
    navigation.navigate('BookingScreen', {
      updating: true,
      pubId,
      bookingDetails: {...booking},
    });
  };

  // Update the reservation in the database
  const editPartySize = () => {
    navigation.navigate('BookingInputScreen', {
      updating: true,
      pubId,
      pubName: booking.pubName,
      selectedDate: new Date(booking.date),
      selectedHour: booking.timeSlot,
      bookingDetails: {...booking},
    });
  };

  // Function to navigate to the pub details screen
  const navigateToPubScreen = () => {
    navigation.navigate('PubDetailsScreen', {pubId});
  };

  // Function to start a chat with the pub
  const startPubChat = () => {
    navigation.navigate('SpecificChatScreen', {targetUserId: pubId});
    console.log('Navigating to chat with pub ID:', pubId);
  };

  // Function to start a chat with the owner
  const startOwnerChat = () => {
    navigation.navigate('SpecificChatScreen', {targetUserId: userId});
    console.log('Navigating to chat with owner ID:', userId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View>
            <TouchableOpacity onPress={navigateToPubScreen}>
              <Image
                source={{uri: booking.pubAvatar}}
                style={styles.pubImage}
              />
            </TouchableOpacity>
            {userId && (
              <TouchableOpacity
                style={[styles.button, styles.chatButton]}
                onPress={startPubChat}>
                <Text style={styles.buttonText}>
                  Chat with {booking.pubName}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.detailsContainer}>
            {isEditMode ? (
              <>
                <View style={styles.editContainer}>
                  <Text style={styles.detail}>Date: </Text>
                  <TouchableOpacity onPress={editDateTime}>
                    <View pointerEvents="none">
                      <TextInput
                        style={styles.input}
                        value={format(details.date, 'dd/MM/yyyy')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.editContainer}>
                  <Text style={styles.detail}>Time: </Text>
                  <TouchableOpacity onPress={editDateTime}>
                    <View pointerEvents="none">
                      <TextInput style={styles.input} value={details.time} />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.editContainer}>
                  <Text style={styles.detail}>Size: </Text>
                  <TouchableOpacity onPress={editPartySize}>
                    <View pointerEvents="none">
                      <TextInput
                        style={styles.input}
                        value={details.partySize.toString()}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.editContainer}>
                  <Text style={styles.detail}>Name: </Text>
                  <TextInput
                    style={styles.input}
                    value={details.name}
                    onChangeText={text => setDetails({...details, name: text})}
                  />
                </View>
                <Text style={styles.detail}>Special Requests: </Text>
                <TextInput
                  style={styles.input}
                  value={details.specialRequest}
                  onChangeText={text =>
                    setDetails({...details, specialRequest: text})
                  }
                />
              </>
            ) : (
              <>
                <View style={styles.nameContainer}>
                  <Text style={styles.title}>{details.name}</Text>
                  {!userId && (
                    <TouchableOpacity
                      style={[styles.chatButtonIcon]}
                      onPress={() => startOwnerChat(booking.userId)}>
                      <Icon name="comments" size={20} color="#FFF" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.detail}>{`Date: ${format(
                  details.date,
                  'dd/MM/yyyy',
                )}`}</Text>
                <Text style={styles.detail}>{`Time: ${details.time}`}</Text>
                <Text
                  style={
                    styles.detail
                  }>{`Party Size: ${details.partySize}`}</Text>
                <Text
                  style={
                    styles.detail
                  }>{`Special Request: ${details.specialRequest}`}</Text>
                <Text style={styles.detail}>Status: {booking.status}</Text>
                {/* Friends */}
                <View style={styles.inviteFriendContainer}>
                  <Text style={styles.title}>
                    Invited Friends ({invitedFriends.length}/
                    {details.partySize - 1})
                  </Text>
                  {isNewMember && (
                    <View>
                      <TouchableOpacity
                        style={styles.openModalButton}
                        onPress={() => setIsModalVisible(true)}>
                        <Icon style={styles.openModalButtonText} name="plus" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                {loading ? (
                  <Loading />
                ) : (
                  <View style={styles.friendItemContainer}>
                    {invitedFriends.map(friend => (
                      <View key={friend.id} style={styles.friendItem}>
                        <Image
                          source={{uri: friend.photoUrl}}
                          style={styles.friendAvatar}
                        />
                        {isNewMember && (
                          <TouchableOpacity
                            onPress={() => handleRemoveFriend(friend.id)}
                            style={styles.deleteButton}>
                            <Text style={styles.deleteButtonText}>X</Text>
                          </TouchableOpacity>
                        )}
                        <Text style={styles.detail}>{friend.displayName}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
            <View style={styles.qrCodeIcon}>
              {isInvitedFriend && (
                <TouchableOpacity onPress={() => setIsQRCodeModalVisible(true)}>
                  <QRCode value={qrCodeData} size={80} />
                </TouchableOpacity>
              )}
              <QRCodeModal />
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => {
                setIsModalVisible(!isModalVisible);
              }}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <TextInput
                    style={styles.searchBar}
                    placeholder="Search for friends..."
                    onChangeText={text => {
                      setSearchQuery(text);
                      handleSearch(text);
                    }}
                    value={searchQuery}
                  />
                  <FlatList
                    data={searchQuery.length > 0 ? filteredFriends : friends}
                    renderItem={({item}) => {
                      const isAdded = invitedFriends.some(
                        friend => friend.id === item.id,
                      );
                      return (
                        <TouchableOpacity
                          onPress={() => !isAdded && handleInvite(item.id)}
                          style={[
                            styles.friendItemModal,
                            selectedFriends.includes(item.id) &&
                              styles.selectedFriendItem,
                            isAdded && styles.friendAlreadyAdded,
                          ]}>
                          <Image
                            source={{uri: item.photoUrl}}
                            style={styles.friendImage}
                          />
                          <View style={styles.friendDetails}>
                            <Text style={{color: isAdded ? '#A0A0A0' : '#000'}}>
                              {item.displayName}
                            </Text>
                            {isAdded && (
                              <Text style={styles.alreadyAddedText}>
                                Already in Reservation
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                    keyExtractor={item => item.id}
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                      setIsModalVisible(false);
                      setSearchQuery('');
                      setFilteredFriends([]);
                    }}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      invitedFriends.length >= details.partySize - 1
                        ? styles.addButtonDisabled
                        : {},
                    ]}
                    onPress={() => {
                      const updatedInvited = [
                        ...invitedFriends,
                        ...selectedFriends.map(id =>
                          friends.find(friend => friend.id === id),
                        ),
                      ];
                      setInvitedFriends(updatedInvited);
                      setSelectedFriends([]);
                      setIsModalVisible(false);
                    }}
                    disabled={invitedFriends.length >= details.partySize - 1}>
                    <Text style={styles.addButtonText}>Add Selected</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {/* Buttons */}
            {isArchived && (
              <View style={styles.buttonContainer}>
                {isEditMode || isNewMember ? (
                  <>
                    <TouchableOpacity
                      style={[styles.button, styles.updateButton]}
                      onPress={handleSave}>
                      <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={handleCancel}>
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {userId && (
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={[styles.button, styles.editButton]}
                          onPress={handleEditToggle}>
                          <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.button, styles.inviteButton]}
                          onPress={handleFriendToggle}>
                          <Text style={styles.buttonText}>Invite Friend</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.button, styles.cancelButton]}
                          onPress={handleDelete}>
                          <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {!userId && (
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={[styles.button, styles.leaveButton]}
                          onPress={handleLeaveReservation}>
                          <Text style={styles.buttonText}>
                            Leave Reservation
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: 'row',
  },
  chatButtonIcon: {
    backgroundColor: '#355E3B',
    padding: 5,
    borderRadius: 20,
    marginLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonModal: {
    marginTop: 10,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  qrCodeText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaveButton: {
    backgroundColor: '#D9534F',
  },
  addButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  inviteFriendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  inviteFriendText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  openModalButton: {
    backgroundColor: '#355E3B',
    padding: 10,
    borderRadius: 20,
  },
  openModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  editContainer: {
    flexDirection: 'row',
  },
  input: {
    fontSize: 16,
    padding: 5,
    margin: 10,
    borderWidth: 1,
    borderColor: '#355E3B',
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: '#355E3B',
  },
  returnButton: {
    backgroundColor: '#B22222',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f1e7',
  },
  container: {
    flex: 1,
  },
  pubImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  pubName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#355E3B',
    textAlign: 'center',
    padding: 10,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#355E3B',
  },
  detail: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
  },
  qrCodeIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 10,
    borderRadius: 20,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#673AB7',
  },
  cancelButton: {
    backgroundColor: '#B22222',
  },
  inviteButton: {
    backgroundColor: '#8B4513',
  },
  chatButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#355E3B',
    width: 'fit',
  },
  friendItemContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
  },
  friendItem: {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    marginRight: 10,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  friendAlreadyAdded: {
    //backgroundColor: '#e0e0e0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  modalList: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 10,
  },

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
  friendItemModal: {
    flexDirection: 'row',
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
  selectedFriendItem: {
    backgroundColor: '#f0f0f0',
  },
  alreadyAddedText: {
    color: '#a0a0a0',
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: '#355E3B',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ReservationDetailsScreen;
