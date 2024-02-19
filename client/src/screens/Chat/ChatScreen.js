import React, {useContext} from 'react';
import {Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import useGroups from '../../hooks/useGroups';
import useNearbyPubs from '../../hooks/useNearbyPubs';
import AuthContext from '../../contexts/AuthContext';

const Tab = createMaterialTopTabNavigator();

const ChatScreen = () => (
  <Tab.Navigator>
    <Tab.Screen name="Garden" component={GardenChat} />
    <Tab.Screen name="Friends" component={FriendsChat} />
    <Tab.Screen name="Groups" component={GroupsChat} />
  </Tab.Navigator>
);

const ChatList = ({groups, navigation}) => {
  const renderChatItem = ({item}) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('SpecificChat', {chatId: item.id})}>
      <Text style={styles.chatTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={groups}
      renderItem={renderChatItem}
      keyExtractor={item => item.id}
    />
  );
};

const GardenChat = ({navigation}) => {
  const nearbyPubs = useNearbyPubs();

  const {currentUserId} = useContext(AuthContext);
  const openChats = useGroups(currentUserId, 'open');
  return <ChatList groups={openChats} navigation={navigation} />;
};

const FriendsChat = ({navigation}) => {
  const {currentUserId} = useContext(AuthContext);
  const friendsChats = useGroups(currentUserId, 'private');
  return <ChatList groups={friendsChats} navigation={navigation} />;
};

const GroupsChat = ({navigation}) => {
  const {currentUserId} = useContext(AuthContext);
  const groupsChats = useGroups(currentUserId, 'group');
  return <ChatList groups={groupsChats} navigation={navigation} />;
};


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
