import React, {useContext, useState, useEffect} from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  useGroups,
  useUserLocation,
  useNearbyPubs,
  useUserProfileData,
} from '@hooks';
import AuthContext from '@contexts/AuthContext';
import {
  fetchUserDetailsById,
  fetchPubDetailsById,
} from '../../../hooks/customer/useReservationActions';
import Loading from '@components/common/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';
import FriendSelectionModal from '@components/chats/FriendSelectionModal';
import CreateGroupModal from '@components/chats/CreateGroupModal';

const Tab = createMaterialTopTabNavigator();

const ChatScreen = ({navigation, item}) => {
  const [activeTab, setActiveTab] = useState('Garden');
  const {currentUserId} = useContext(AuthContext);
  const userId = currentUserId;
  const {friends, loading} = useUserProfileData(userId);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);

  useEffect(() => {
    let headerRight = null;

    switch (activeTab) {
      case 'Friends':
        headerRight = () => (
          <Icon
            style={styles.icon}
            name="search"
            size={20}
            color="#000"
            onPress={() =>
              activeTab === 'Friends' ? setModalVisible(true) : {}
            }
          />
        );
        break;
      case 'Groups':
        headerRight = () => (
          <Icon
            style={styles.icon}
            name="plus"
            size={20}
            color="#000"
            onPress={() => setGroupModalVisible(true)}
          />
        );
        break;
      default:
        headerRight = null;
        break;
    }

    navigation.setOptions({headerRight});
  }, [activeTab, navigation]);

  if (loading) return <Loading />;

  return (
    <>
      <Tab.Navigator>
        <Tab.Screen
          name="Garden"
          component={GardenChat}
          listeners={{focus: () => setActiveTab('Garden')}}
        />
        <Tab.Screen
          name="Friends"
          component={FriendsChat}
          listeners={{focus: () => setActiveTab('Friends')}}
        />
        <Tab.Screen
          name="Groups"
          component={GroupsChat}
          listeners={{focus: () => setActiveTab('Groups')}}
        />
      </Tab.Navigator>
      <FriendSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        friends={friends}
        userId={userId}
      />
      <CreateGroupModal
        visible={groupModalVisible}
        onClose={() => setGroupModalVisible(false)}
        friends={friends}
        userId={userId}
        item={item}
      />
    </>
  );
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

const PubChatItem = ({item, navigation, userLocation}) => {
  const [pubDetails, setPubDetails] = useState(null);
  const {currentUserId} = useContext(AuthContext);

  console.log('PubChatItem:', item);

  useEffect(() => {
    fetchPubDetailsById(item.pubId).then(setPubDetails);
  }, [item.pubId]);

  // Calculate distance and convert to a suitable format (meters or kilometers)
  let distance = '';
  if (pubDetails && userLocation) {
    const distanceInKm = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      pubDetails.location.latitude,
      pubDetails.location.longitude,
    );
    if (distanceInKm < 1) {
      // Convert to meters and show without decimal places for distances less than 1 km
      const distanceInMeters = Math.round(distanceInKm * 1000);
      distance = `${distanceInMeters}m away`;
    } else {
      // For distances 1 km or more, show in kilometers with one decimal place
      distance = `${distanceInKm.toFixed(1)}km away`;
    }
  }

  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate('SpecificChat', {
          chatId: item.id,
          currentUserId,
          chatType: item.chatType,
          displayName: pubDetails?.displayName,
        })
      }>
      <Image source={{uri: pubDetails?.photoUrl}} style={styles.avatar} />
      <View style={styles.chatDetails}>
        <Text style={styles.chatTitle}>{pubDetails?.displayName}</Text>
        <Text style={styles.chatSnippet}>Open chat</Text>
        {distance && <Text style={styles.chatSnippet}>{distance}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const FriendChatItem = ({item, navigation, currentUserId}) => {
  const [userDetails, setUserDetails] = useState(null);
  const [pubDetails, setPubDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const targetUserId = item.members.find(member => member !== currentUserId);
    fetchUserDetailsById(targetUserId).then(details => {
      setUserDetails(details);
      setLoading(false);
    });
    fetchPubDetailsById(targetUserId).then(details => {
      setPubDetails(details);
      setLoading(false);
    });
  }, [item, currentUserId]);

  const handlePress = () => {
    const targetUserId = item.members.find(member => member !== currentUserId);
    if (loading) return;
    navigation.navigate('SpecificChat', {
      chatId: item.id,
      currentUserId,
      targetUserId,
      chatType: item.type,
      groupData: item,
      displayName: pubDetails?.displayName || userDetails?.displayName,
    });
  };

  return (
    <TouchableOpacity style={styles.chatItem} onPress={handlePress}>
      <>
        {pubDetails ? (
          <Image source={{uri: pubDetails.photoUrl}} style={styles.avatar} />
        ) : (
          <Image source={{uri: userDetails?.photoUrl}} style={styles.avatar} />
        )}
        <View style={styles.chatDetails}>
          <Text style={styles.chatTitle}>
            {pubDetails ? pubDetails.displayName : userDetails?.displayName}
          </Text>
          <Text style={styles.chatSnippet}>{item.lastMessage?.messageText}</Text>
        </View>
      </>
    </TouchableOpacity>
  );
};

const GroupChatItem = ({item, navigation, currentUserId}) => {
  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate('SpecificChat', {
          chatId: item.id,
          currentUserId,
          chatType: item.type,
          groupData: item,
          displayName: item.name,
        })
      }>
      <Image source={{uri: item.photoUrl}} style={styles.avatar} />
      <View style={styles.chatDetails}>
        <Text style={styles.chatTitle}>{item.name}</Text>
        <Text style={styles.chatSnippet}>{item.lastMessage?.messageText}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ChatList = ({groups, navigation, fetchAdditionalDetails}) => {
  const {currentUserId} = useContext(AuthContext);

  const renderItem = ({item}) => {
    if (fetchAdditionalDetails) {
      return (
        <FriendChatItem
          item={item}
          navigation={navigation}
          currentUserId={currentUserId}
        />
      );
    } else {
      return <GroupChatItem item={item} navigation={navigation} />;
    }
  };

  return (
    <FlatList
      data={groups}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const GardenChat = ({navigation}) => {
  const {location} = useUserLocation();
  const {pubs, loading} = useNearbyPubs(
    location?.latitude,
    location?.longitude,
    0.1, // 0.1 km = 100 meters
  );

  // Calculate distance for each pub and sort them
  let sortedPubs = pubs
    .map(pub => ({
      ...pub,
      distance: calculateDistance(
        location?.latitude,
        location?.longitude,
        pub.latitude,
        pub.longitude,
      ),
    }))
    .sort((a, b) => a.distance - b.distance);

  if (loading) return <Loading />;

  return (
    <FlatList
      data={sortedPubs.map(pub => ({
        ...pub,
        id: pub.group,
        pubId: pub.id,
        chatType: 'open',
      }))}
      renderItem={({item}) => (
        <PubChatItem
          item={item}
          navigation={navigation}
          userLocation={location}
        />
      )}
      keyExtractor={item => item.id}
    />
  );
};

const FriendsChat = ({navigation}) => {
  const {currentUserId} = useContext(AuthContext);
  const friendsChats = useGroups(currentUserId, 'private');

  return (
    <ChatList
      groups={friendsChats}
      navigation={navigation}
      fetchAdditionalDetails={true}
    />
  );
};

const GroupsChat = ({navigation}) => {
  const {currentUserId} = useContext(AuthContext);
  const groupsChats = useGroups(currentUserId, 'group');

  return (
    <ChatList
      groups={groupsChats}
      navigation={navigation}
      fetchAdditionalDetails={false}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f1e7',
  },
  chatItem: {
    backgroundColor: '#355E3B',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatDetails: {
    flex: 1,
  },
  chatTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatSnippet: {
    color: '#FFF',
    fontSize: 14,
  },
  tabBar: {
    /* backgroundColor: '#673AB7', */
  },
  messageItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '70%',
    alignSelf: 'flex-start',
  },
  currentUserMessage: {
    backgroundColor: '#673AB7',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  otherUserMessage: {
    backgroundColor: '#355E3B',
    marginLeft: 10,
  },
  messageUserName: {
    fontWeight: 'bold',
  },
  messageText: {
    color: '#FFF',
  },
  messageTime: {
    alignSelf: 'flex-end',
    fontSize: 10,
    color: '#FFF',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f8f1e7',
  },
  input: {
    flex: 1,
    borderColor: '#673AB7',
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    backgroundColor: '#FFF',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#673AB7',
    padding: 10,
    borderRadius: 10,
  },
  sendButtonText: {
    color: '#FFF',
  },
});

export default ChatScreen;
