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
  
    navigation.setOptions({ headerRight });
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

const ChatItem = ({
  item,
  navigation,
  fetchAdditionalDetails,
  currentUserId,
}) => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (fetchAdditionalDetails) {
      const targetUserId = item.members.find(
        member => member !== currentUserId,
      );
      fetchUserDetailsById(targetUserId).then(setUserDetails);
    }
  }, [item, fetchAdditionalDetails, currentUserId]);

  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate('SpecificChat', {
          chatId: item.id,
          currentUserId,
          targetUserId: userDetails ? userDetails.id : item.id,
          chatType: item.type,
          groupData: item,
        })
      }>
      <>
        <Image
          source={{
            uri:
              fetchAdditionalDetails && userDetails
                ? userDetails.photoUrl
                : item.photoUrl,
          }}
          style={styles.avatar}
        />
        <View style={styles.chatDetails}>
          <Text style={styles.chatTitle}>
            {fetchAdditionalDetails && userDetails
              ? userDetails.displayName
              : item.name}
          </Text>
          <Text style={styles.chatSnippet}> {item.lastMessage?.messageText} </Text>
        </View>
      </>
    </TouchableOpacity>
  );
};

const PubChatItem = ({item, navigation}) => {
  const [pubDetails, setPubDetails] = useState(null);
  const {currentUserId} = useContext(AuthContext);

  useEffect(() => {
    fetchPubDetailsById(item.pubId).then(setPubDetails);
  }, [item.pubId]);

  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate('SpecificChat', {
          chatId: item.id,
          currentUserId,
          chatType: item.chatType,
        })
      }>
      <Image source={{uri: pubDetails?.photoUrl}} style={styles.avatar} />
      <View style={styles.chatDetails}>
        <Text style={styles.chatTitle}>{pubDetails?.displayName}</Text>
        <Text style={styles.chatSnippet}>Open chat with the pub</Text>
      </View>
    </TouchableOpacity>
  );
};

const ChatList = ({groups, navigation, fetchAdditionalDetails}) => {
  const {currentUserId} = useContext(AuthContext);

  return (
    <FlatList
      data={groups}
      renderItem={({item}) => (
        <ChatItem
          item={item}
          navigation={navigation}
          fetchAdditionalDetails={fetchAdditionalDetails}
          currentUserId={currentUserId}
        />
      )}
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

  const nearbyPubChats = pubs.map(pub => ({
    id: pub.group,
    pubId: pub.id,
    chatType: 'open',
  }));

  if (loading) return <Loading />;

  return (
    <FlatList
      data={nearbyPubChats}
      renderItem={({item}) => (
        <PubChatItem item={item} navigation={navigation} />
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
