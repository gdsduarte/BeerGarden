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
import useChatMessages from '../../hooks/useChatMessages';
import AuthContext from '../../contexts/AuthContext';
import {findOrCreateChat, sendMessage} from '../../services/chat/chatService';

const SpecificChatScreen = ({route, navigation}) => {
  const {targetUserId, chatId: initialChatId} = route.params;
  const {currentUserId} = useContext(AuthContext);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();
  const {messages, refreshMessages} = useChatMessages(initialChatId);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Chat Name', // Ideally, fetch and display the chat name dynamically
      headerRight: () => (
        <Image
          source={{uri: 'https://example.com/avatar.jpg'}}
          style={styles.avatar}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const message = {
      messageText: inputText.trim(),
      sentBy: currentUserId,
    };

    if (!initialChatId && targetUserId) {
      try {
        // Simplifying group data structure for initial creation
        const groupData = {
          createdBy: currentUserId,
          members: [currentUserId, targetUserId],
          type: 'private',
        };
        const newChatId = await findOrCreateChat(
          currentUserId,
          targetUserId,
          message,
          groupData,
        );
        // Update the chatId in the route params to ensure future messages are sent to the correct chat
        route.params.chatId = newChatId;
        //refreshMessages(); // Assuming this function fetches messages for the new chatId
      } catch (error) {
        console.error('Error initializing new chat:', error);
      }
    } else {
      try {
        await sendMessage(initialChatId || route.params.chatId, message);
        //refreshMessages(); // Refresh messages to include the new one
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }

    setInputText(''); // Clear input after sending
  };

  // Render function for message items
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
