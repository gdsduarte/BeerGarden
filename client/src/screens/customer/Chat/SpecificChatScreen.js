import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import {useChatMessages} from '../../../hooks';
import AuthContext from '../../../contexts/AuthContext';
import {
  manageChatAndSendMessage,
  findChat,
} from '../../../services/chat/chatService';

const SpecificChatScreen = ({route, navigation}) => {
  const {targetUserId, chatId: initialChatId} = route.params;
  const {currentUserId} = useContext(AuthContext);
  const [chatId, setChatId] = useState(null);
  const [inputText, setInputText] = useState('');
  const {messages} = useChatMessages(chatId);
  const flatListRef = useRef();

  useEffect(() => {
    // Immediately try to find an existing chat if chatId is not provided through params
    const initChat = async () => {
      if (!initialChatId && targetUserId) {
        const foundChatId = await findChat(currentUserId, targetUserId);
        if (foundChatId) {
          setChatId(foundChatId);
        }
      } else {
        setChatId(initialChatId);
      }
    };

    initChat();
  }, [currentUserId, targetUserId, initialChatId]);

  // Navigation options
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Chat Name',
      headerRight: () => (
        <Image
          source={{uri: 'https://example.com/avatar.jpg'}}
          style={styles.avatar}
        />
      ),
    });
  }, [navigation]);

  // Scroll to end when messages update
  useEffect(() => {
    flatListRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      const usedChatId = await manageChatAndSendMessage(
        currentUserId,
        targetUserId,
        inputText,
      );
      if (!chatId) setChatId(usedChatId); // Update state only if chatId was not previously set
      setInputText(''); // Clear input after successful send
    } catch (error) {
      console.error('Error managing chat or sending message:', error);
    }
  };

  // Render message item
  const renderMessageItem = ({item}) => (
    <View
      style={[
        styles.messageItem,
        item.sentBy === currentUserId
          ? styles.currentUserMessage
          : styles.otherUserMessage,
      ]}>
      <Text style={styles.messageText}>{item.messageText}</Text>
      <Text style={styles.messageTime}>
        {item.sentAt?.toDate().toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={styles.listContentContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContentContainer: {
    paddingVertical: 10,
  },
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
