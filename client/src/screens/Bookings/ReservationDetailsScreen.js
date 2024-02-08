import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Share,
  Image,
  TouchableOpacity,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {format} from 'date-fns';

const ReservationDetailsScreen = ({route, navigation}) => {
  const {booking} = route.params;
  const isArchived = booking.isBooked === true;
  const [invitedFriends, setInvitedFriends] = useState([]);
  // Convert Firestore Timestamps to JavaScript Date objects and format them
  const isValidDate = booking.date && booking.date.toDate instanceof Function;
  const bookingDate = isValidDate ? booking.date.toDate() : new Date();
  const formattedDate = format(bookingDate, 'dd-MM-yyyy');
  const formattedTime = format(bookingDate, 'HH:mm');

  console.log('booking', booking);

  React.useLayoutEffect(() => {
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
    navigation.navigate('SpecificChatScreen', {pubId: booking.pubId});
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateToPubScreen}>
        <Image source={{uri: booking.pubAvatar}} style={styles.pubImage} />
      </TouchableOpacity>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{booking.name}</Text>
        <Text style={styles.detail}>Date: {formattedDate}</Text>
        <Text style={styles.detail}>Time: {formattedTime}</Text>
        <Text style={styles.detail}>Number of People: {booking.partySize}</Text>
        <Text style={styles.detail}>
          Special Requests: {booking.specialRequest}
        </Text>
        <Text style={styles.detail}>Status: {booking.status}</Text>
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
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => {
                /* Edit logic */
              }}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.inviteButton]}
              onPress={() => {
                /* Invite logic */
              }}>
              <Text style={styles.buttonText}>Invite</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                /* Cancel logic */
              }}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.chatButton} onPress={startChat}>
          <Text style={styles.buttonText}>Chat with Pub</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    flexDirection: 'row',
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
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
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
