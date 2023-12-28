import React, { useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const SpecificChatScreen = ({ route, navigation }) => {
  const { userId, userName, userAvatar } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

useLayoutEffect(() => {
  navigation.setOptions({
    headerShown: true,
    title: userName,
    headerRight: () => (
      <Image 
        source={{ uri: userAvatar }}
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
      />
    ),
    tabBarVisible: false,
  });
}, [navigation, userName, userAvatar]);

  // Function to send a new message
  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, senderId: 'currentUser', timestamp: new Date().toLocaleTimeString() }]);
      setNewMessage('');
    }
  };

  // Render each message item
  const renderMessageItem = ({ item }) => (
    <View style={item.senderId === 'currentUser' ? styles.myMessage : styles.theirMessage}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{item.timestamp}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item, index) => index.toString()}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f1e7',  // Cream color for background
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#8B4513', // Deep amber for sent messages
    padding: 10,
    borderRadius: 15,
    margin: 5,
    maxWidth: '80%',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#355E3B', // Deep green for received messages
    padding: 10,
    borderRadius: 15,
    margin: 5,
    maxWidth: '80%',
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
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#DDD',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#EEE',
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#8B4513',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default SpecificChatScreen;
