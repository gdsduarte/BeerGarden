import React, {useState, useLayoutEffect, useRef, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import useChatMessages from '../hooks/useChatMessages';
import AuthContext from '../contexts/AuthContext';

const SpecificChatScreen = ({route, navigation}) => {
  const {chatId} = route.params;
  const {currentUserUID} = useContext(AuthContext);
  const {messages, sendMessage} = useChatMessages(chatId);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();

  // Placeholder values for chat details
  const chatName = 'Chat Name';
  const chatAvatar = 'https://example.com/avatar.jpg';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: chatName,
      headerRight: () => (
        <Image source={{uri: chatAvatar}} style={styles.avatar} />
      ),
      tabBarVisible: false,
    });
  }, [navigation, chatName, chatAvatar]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      sendMessage({
        sentBY: currentUserUID,
        messageText: inputText,
      });
      setInputText('');
      setTimeout(() => flatListRef.current.scrollToEnd({animated: true}), 100);
    }
  };

  const renderMessageItem = ({item}) => (
    <View
      style={[
        styles.messageItem,
        item.sentBy === currentUserUID
          ? styles.otherUserMessage
          : styles.currentUserMessage,
      ]}>
      <Text style={styles.messageText}>{item.messageText}</Text>
      <Text style={styles.messageTime}>
        {item.sentAt.toDate().toLocaleTimeString()}
      </Text>
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
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
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
