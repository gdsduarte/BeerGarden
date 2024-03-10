import React, {useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Share,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {format} from 'date-fns';

// Helper function to safely get a JavaScript Date object
function getDate(date) {
  if (date?.toDate) {
    return date.toDate(); // Firestore Timestamp to Date
  } else if (date instanceof Date) {
    return date; // It's already a Date object
  } else {
    return new Date(date); // Handle as string or other formats
  }
}

const ReservationDetailsScreen = ({route, navigation}) => {
  const {booking, selectedDate, selectedHour} = route.params;
  const isArchived = booking.isBooked === true;
  const [invitedFriends, setInvitedFriends] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const bookingDate = getDate(booking.date);
  const formattedDate = format(bookingDate, 'dd/MM/yyyy');
  const formattedTime = format(bookingDate, 'HH:mm');

  // For demonstration, using static values
  const [name, setName] = useState(booking.userName);
  const [date, setDate] = useState(formattedDate);
  const [time, setTime] = useState(formattedTime);
  const [partySize, setPartySize] = useState(booking.partySize);
  const [specialRequest, setSpecialRequest] = useState(booking.specialRequest);

  console.log('booking', booking);

  useLayoutEffect(() => {
    navigation.setOptions({title: booking.pubName});
  }, [navigation, booking.pubName]);

  const inviteFriend = friend => {
    setInvitedFriends([...invitedFriends, friend]);
  };

  const navigateToPubScreen = () => {
    navigation.navigate('PubDetailsScreen', {pubId: booking.pubId});
  };

  const shareQRCode = () => {
    if (isArchived) {
      Share.share({message: booking.pubName});
    }
  };

  const startChat = () => {
    navigation.navigate('SpecificChatScreen', {targetUserId: booking.pubId});
    console.log('Navigating to chat with pub ID:', booking.pubId);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const editDateTime = () => {
    navigation.navigate('BookingScreen', {
      updating: true,
      pubId: booking.pubId,
      bookingDetails: {...booking},
    });
    console.log('Booking details3333:', booking);
    console.log('PubId:', booking.pubId);
  };

  const editPartySize = () => {
    navigation.navigate('BookingInputScreen', {
      updating: true,
      pubId: booking.pubId,
      bookingDetails: {...booking},
      selectedDate,
      selectedHour,
    });
    console.log('Booking details:', booking);
  };

  const handleUpdate = () => {
    // Implement your update logic here
    console.log('Updated details: ', {name, partySize, specialRequest});
    setIsEditMode(false);
    // Navigate back or show success message
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateToPubScreen}>
        <Image source={{uri: booking.pubAvatar}} style={styles.pubImage} />
      </TouchableOpacity>
      <View style={styles.detailsContainer}>
        {isEditMode ? (
          <>
            <View style={styles.editContainer}>
              <Text style={styles.detail}>Name: </Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.editContainer}>
              <Text style={styles.detail}>Date: </Text>
              <TouchableOpacity
                style={styles.input}
                onPress={editDateTime}
                onChangeText={setDate}>
                <Text>{date}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.editContainer}>
              <Text style={styles.detail}>Time: </Text>
              <TouchableOpacity
                style={styles.input}
                onPress={editDateTime}
                onChangeText={setTime}>
                <Text>{time}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.editContainer}>
              <Text style={styles.detail}>Size: </Text>
              <TouchableOpacity
                style={styles.input}
                onPress={editDateTime}
                onChangeText={setPartySize}>
                <Text>{partySize}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.detail}>Special Requests: </Text>
            <TextInput
              style={styles.input}
              value={specialRequest}
              onChangeText={setSpecialRequest}
            />
          </>
        ) : (
          <>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.detail}>Date: {formattedDate}</Text>
            <Text style={styles.detail}>Time: {formattedTime}</Text>
            <Text style={styles.detail}>
              Number of People: {booking.partySize}
            </Text>
            <Text style={styles.detail}>
              Special Requests: {booking.specialRequest}
            </Text>
            <Text style={styles.detail}>Status: {booking.status}</Text>
          </>
        )}
        <TouchableOpacity style={styles.qrCodeIcon} onPress={shareQRCode}>
          <QRCode value={booking.qrCodeData} size={50} />
        </TouchableOpacity>
        <View style={styles.invitedFriendsContainer}>
          {invitedFriends.map(friend => (
            <Image
              key={friend.id}
              source={{uri: friend.avatar}}
              style={styles.friendAvatar}
            />
          ))}
        </View>
        {isArchived && (
          <View style={styles.buttonContainer}>
            {isEditMode ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.updateButton]}
                  onPress={handleUpdate}>
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.returnButton]}
                  onPress={toggleEditMode}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={toggleEditMode}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {}}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.inviteButton]}
                  onPress={() => {}}>
                  <Text style={styles.buttonText}>Invite</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.chatButton]}
                  onPress={startChat}>
                  <Text style={styles.buttonText}>Chat with Pub</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: '#f8f1e7',
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 20,
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
    backgroundColor: '#355E3B',
  },
  invitedFriendsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
  },
  friendAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
});

export default ReservationDetailsScreen;
