import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ChatScreen = () => {
  const navigation = useNavigation();

  // Dummy chat data
  const chats = [
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
    // ... add more chat sessions as needed
  ];

  // Dummy data for a specific chat conversation with "Alice"
  const specificChatWithAlice = [
    // Messages between the current user and "Alice"
    {
      messageId: 'm1',
      text: 'Hey, how are you doing?',
      senderId: 'user1',
      timestamp: '10:20 AM',
    },
    {
      messageId: 'm2',
      text: 'I’m good, thanks! Working on the project right now.',
      senderId: 'currentUser',
      timestamp: '10:25 AM',
    },
    // ... more messages
  ];

  // State to hold the specific chat data
  const [currentChat, setCurrentChat] = useState([]);

  // Open chat with Alice when any chat item is clicked (for demonstration)
  const openChat = (item) => {
    navigation.navigate('SpecificChat', { 
      userId: item.userId,
      userName: item.userName,
      userAvatar: item.avatar
    });
  };
  

  // Render item for specific chat messages
  const renderMessageItem = ({item}) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{item.timestamp}</Text>
    </View>
  );

  // Render Item for the FlatList
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
    <View style={styles.container}>
      <FlatList
        data={chats.length > 0 ? chats : currentChat} // Display specific chat if available
        renderItem={chats.length > 0 ? renderChatItem : renderMessageItem}
        keyExtractor={item => item.messageId || item.userId}
      />
    </View>
  );
};

// Styles following the Beer Garden theme
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f1e7', // Cream color for background
  },
  chatItem: {
    backgroundColor: '#355E3B', // Deep green for chat items
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
    color: '#FFF', // White text for contrast
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatSnippet: {
    color: '#FFF',
    fontSize: 14,
  },
  messageItem: {
    // Style for specific chat messages
    padding: 10,
    backgroundColor: '#e7e7e7', // Example: Light grey for message bubbles
    margin: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  messageText: {
    // Style for message text
  },
  messageTime: {
    // Style for message timestamp
    fontSize: 10,
    color: '#999',
  },
  // ... add more styles as needed
});

export default ChatScreen;
