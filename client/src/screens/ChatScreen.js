import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const gardenMessages = [
  {id: '1', text: 'Hello everyone!', userName: 'User1'},
  {id: '2', text: 'Welcome to the Beer Garden!', userName: 'User2'},
  {id: '3', text: 'This is a test message', userName: 'User3'},
];
const friendsChats = [
  {
    userId: 'user1',
    userName: 'Alice',
    lastMessage: 'Hey, how are you doing?',
    avatar: 'https://example.com/avatar1.jpg',
    lastMessageTime: '10:30 AM',
  },
  {
    userId: 'user2',
    userName: 'Bob',
    lastMessage: 'Are we still on for Friday?',
    avatar: 'https://example.com/avatar2.jpg',
    lastMessageTime: 'Yesterday',
  },
  {
    userId: 'user3',
    userName: 'Charlie',
    lastMessage: 'That sounds great!',
    avatar: 'https://example.com/avatar3.jpg',
    lastMessageTime: '2 days ago',
  },
];
const groupsChats = [
  {
    userId: 'user4',
    userName: 'Beer Garden',
    lastMessage: 'Welcome to the Beer Garden!',
    avatar: 'https://example.com/avatar4.jpg',
    lastMessageTime: '10:30 AM',
  },
  {
    userId: 'user5',
    userName: 'Beer Garden',
    lastMessage: 'Welcome to the Beer Garden!',
    avatar: 'https://example.com/avatar5.jpg',
    lastMessageTime: 'Yesterday',
  },
];

const ChatList = ({chats, navigation}) => {
  const openChat = item => {
    navigation.navigate('SpecificChat', {
      userId: item.userId,
      userName: item.userName,
    });
  };

  const renderChatItem = ({item}) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
      <Image source={{uri: item.avatar}} style={styles.avatar} />
      <View style={styles.chatDetails}>
        <Text style={styles.chatTitle}>{item.userName}</Text>
        <Text style={styles.chatSnippet}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={chats}
      renderItem={renderChatItem}
      keyExtractor={item => item.userId}
    />
  );
};

const GardenChat = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(gardenMessages); /* const [messages, setMessages] = useState([]); */
  const flatListRef = useRef();

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: new Date().getTime().toString(),
        text: inputText,
        userName: 'You',
        time: new Date().toLocaleTimeString(),
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
      setTimeout(() => flatListRef.current.scrollToEnd({animated: true}), 100);
    }
  };

  const renderMessageItem = ({item}) => (
    <View
      style={[
        styles.messageItem,
        item.userName === 'You'
          ? styles.currentUserMessage
          : styles.otherUserMessage,
      ]}>
      <Text style={styles.messageUserName}>{item.userName}</Text>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        inverted={false}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FriendsChat = ({navigation}) => (
  <ChatList chats={friendsChats} navigation={navigation} />
);
const GroupsChat = ({navigation}) => (
  <ChatList chats={groupsChats} navigation={navigation} />
);

const ChatScreen = () => (
  <Tab.Navigator screenOptions={{tabBarStyle: styles.tabBar}}>
    <Tab.Screen name="Garden" component={GardenChat} />
    <Tab.Screen name="Friends">
      {props => <FriendsChat {...props} />}
    </Tab.Screen>
    <Tab.Screen name="Groups">{props => <GroupsChat {...props} />}</Tab.Screen>
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
