import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Modal,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AuthContext from '@contexts/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import {format, differenceInHours, parseISO} from 'date-fns';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  fetchUserDetailsById,
  updateReservation,
  sendNotificationToUser,
} from '../../hooks/customer/useReservationActions';

const PubReservationDetailsScreen = ({route}) => {
  const {booking: initialBooking} = route.params;
  const [booking, setBooking] = useState(initialBooking);
  const {currentUserId} = useContext(AuthContext);
  const userId = currentUserId;
  const pubId = booking.pubId;
  const navigation = useNavigation();
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState(
    booking.members.filter(id => id !== userId && id !== pubId),
  );
  const [isDeclineEnabled, setIsDeclineEnabled] = useState(false);

  useEffect(() => {
    const now = new Date();
    const reservationDate = new Date(booking.date);
    const hoursDiff = differenceInHours(reservationDate, now);

    const canDecline =
      booking.status === 'pending' ||
      (booking.status === 'accepted' && hoursDiff > 24);

    setIsDeclineEnabled(canDecline);
  }, [booking]);

  useEffect(() => {
    const fetchInvitedFriendsDetails = async () => {
      const invitedMemberIds = booking.members.filter(
        id => id !== userId && id !== pubId,
      );
      const promises = invitedMemberIds.map(id => fetchUserDetailsById(id));
      const membersDetails = await Promise.all(promises);

      setInvitedFriends(membersDetails);
    };

    fetchInvitedFriendsDetails();
  }, [booking.members, userId, pubId]);

  const updateReservationAndNotify = async status => {
    const reservationId = booking.id;
    const notificationDetails = {
      reservationId: reservationId,
      userId: booking.createdBy,
      pubId: currentUserId,
      message: `Your reservation has been ${status}.`,
    };

    try {
      // Update the reservation status
      await updateReservation(reservationId, {status});
      // Send a notification to the user with more details
      await sendNotificationToUser(notificationDetails);

      // Update the local booking state to reflect the new status
      setBooking({...booking, status});

      Alert.alert('Success', `The reservation has been ${status}.`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', `Failed to update the reservation to '${status}'.`);
    }
  };

  const handleAcceptReservation = () => {
    Alert.alert(
      'Accept Reservation',
      'Are you sure you want to accept this reservation?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: () => updateReservationAndNotify('accepted'),
        },
      ],
    );
  };

  const handleDeclineReservation = () => {
    if (!isDeclineEnabled) {
      Alert.alert(
        'Decline Unavailable',
        'Reservations can only be declined more than 24 hours in advance.',
      );
      return;
    }

    Alert.alert(
      'Decline Reservation',
      'Are you sure you want to decline this reservation?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Decline',
          onPress: () => updateReservationAndNotify('declined'),
        },
      ],
    );
  };

  const startChatWithUser = () => {
    navigation.navigate('SpecificChatScreen', {
      targetUserId: booking.createdBy,
      displayName: booking.name,
    });
  };

  const onScan = e => {
    console.log(e.data);
    setIsScannerVisible(false);
    if (e.data === booking.id) {
      Alert.alert('Check-in Successful', 'You have checked in successfully.');
    } else {
      Alert.alert('Invalid QR Code', 'Please scan the correct QR code.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={isScannerVisible}
        onRequestClose={() => setIsScannerVisible(false)}>
        <QRCodeScanner
          onRead={onScan}
          topContent={<Text>Scan the reservation QR code.</Text>}
        />
      </Modal>
      <Text style={styles.title}>Reservation Details</Text>
      <Text style={styles.detail}>Name: {booking.name}</Text>
      <Text style={styles.detail}>
        Date: {format(new Date(booking.date), 'dd/MM/yyy')}
      </Text>
      <Text style={styles.detail}>
        Time: {format(new Date(booking.date), 'HH:mm')}
      </Text>
      <Text style={styles.detail}>Party Size: {booking.partySize}</Text>
      <Text style={styles.detail}>
        Special Request: {booking.specialRequest || 'None'}
      </Text>
      <Text style={styles.detail}>Status: {booking.status}</Text>
      <Text style={styles.title}>
        Invited Friends ({invitedFriends.length})
      </Text>
      <View style={styles.friendItemContainer}>
        {invitedFriends.map(friend => (
          <View key={friend.id} style={styles.friendItem}>
            <Image
              style={styles.friendAvatar}
              source={{uri: friend.photoUrl}}
            />
            <Text style={styles.friendName}>{friend.displayName}</Text>
          </View>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleAcceptReservation}
          style={[
            styles.button,
            styles.acceptButton,
            booking.status === 'accepted' && styles.buttonDisabled,
          ]}
          disabled={booking.status === 'accepted'}>
          <Icon name="check" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDeclineReservation}
          style={[
            styles.button,
            styles.declineButton,
            booking.status === 'declined' ||
              (!isDeclineEnabled && styles.buttonDisabled),
          ]}
          disabled={booking.status === 'declined'}>
          <Icon name="times" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={startChatWithUser}
          style={[styles.button, styles.chatButton]}>
          <Icon name="comments" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => setIsScannerVisible(true)}
        style={styles.scanButton}>
        <Text style={styles.buttonText}>Scan QR Code</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scanButton: {
    marginTop: 20,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  chatButton: {
    backgroundColor: '#2196F3',
  },
  friendItemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    borderWidth: 2,
    borderColor: '#FFF',
  },
  friendName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default PubReservationDetailsScreen;
