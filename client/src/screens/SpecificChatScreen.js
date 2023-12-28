import React, {useState, useLayoutEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const chatMessages = [
  {id: '1', text: 'Hello everyone!', userName: 'User1'},
  {id: '2', text: 'Welcome to the Beer Garden!', userName: 'User2'},
  {id: '3', text: 'This is a test message', userName: 'User3'},
];

const SpecificChatScreen = ({route, navigation}) => {
  const {userId, userName, userAvatar} = route.params;
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(chatMessages); /* const [messages, setMessages] = useState([]); */
  const flatListRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: userName,
      headerRight: () => (
        <Image source={{uri: userAvatar}} style={styles.avatar} />
      ),
      tabBarVisible: false,
    });
  }, [navigation, userName, userAvatar]);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f1e7',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
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
  messageText: {
    color: '#FFF',
  },
  messageUserName: {
    fontWeight: 'bold',
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
