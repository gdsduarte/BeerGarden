import React, {useContext} from 'react';
import {Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import useChats from '../hooks/useChats';
import useNearbyPubs from '../hooks/useNearbyPubs';
import AuthContext from '../contexts/AuthContext';

const Tab = createMaterialTopTabNavigator();

const ChatList = ({chats, navigation}) => {
  const renderChatItem = ({item}) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('SpecificChat', {chatId: item.id})}>
      <Text style={styles.chatTitle}>{item.title}</Text>
      {/* other chat item details */}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={chats}
      renderItem={renderChatItem}
      keyExtractor={item => item.id}
    />
  );
};

const GardenChat = ({navigation}) => {
  const nearbyPubs = useNearbyPubs();

  // Define how each pub item is rendered
  const renderPubItem = ({item}) => (
    <TouchableOpacity
      style={styles.pubItem}
      onPress={() => navigation.navigate('SpecificChat', {pubId: item.id})}>
      <Text style={styles.pubTitle}>{item.name}</Text>
      {/* Add other pub details */}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={nearbyPubs}
      renderItem={renderPubItem}
      keyExtractor={item => item.id}
    />
  );
};

const FriendsChat = ({navigation}) => {
  const {currentUserUID} = useContext(AuthContext);
  const friendsChats = useChats(currentUserUID, 'private');
  return <ChatList chats={friendsChats} navigation={navigation} />;
};

const GroupsChat = ({navigation}) => {
  const {currentUserUID} = useContext(AuthContext);
  const groupsChats = useChats(currentUserUID, 'group');
  return <ChatList chats={groupsChats} navigation={navigation} />;
};

const ChatScreen = () => (
  <Tab.Navigator>
    <Tab.Screen name="Garden" component={GardenChat} />
    <Tab.Screen name="Friends" component={FriendsChat} />
    <Tab.Screen name="Groups" component={GroupsChat} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
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
