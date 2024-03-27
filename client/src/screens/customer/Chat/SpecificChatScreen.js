import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {useChatMessages} from '@hooks';
import AuthContext from '@contexts/AuthContext';
import {
  manageChatAndSendMessage,
  findChat,
  sendMessage,
  deleteMessage,
} from '@services/chat/chatService';
import GroupInfoModal from '@components/chats/GroupInfoModal';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SpecificChatScreen = ({route, navigation}) => {
  const {targetUserId, chatId: initialChatId, groupData: initialGroupData} = route.params;
  const {currentUserId} = useContext(AuthContext);
  const [chatId, setChatId] = useState(initialChatId);
  const [inputText, setInputText] = useState('');
  const {messages} = useChatMessages(chatId);
  const flatListRef = useRef();
  const [isModalVisible, setModalVisible] = useState(false);

  // State to manage updates to groupData
  const [updatedGroupData, setUpdatedGroupData] = useState(initialGroupData);

  const handleMemberChange = (updatedMemberIds) => {
    setUpdatedGroupData(prevData => ({
      ...prevData,
      members: updatedMemberIds,
    }));
  };  

  useEffect(() => {
    const initChat = async () => {
      if (!chatId && targetUserId) {
        const foundChatId = await findChat(currentUserId, targetUserId);
        if (foundChatId) {
          setChatId(foundChatId);
        }
      }
    };

    initChat();
  }, [currentUserId, targetUserId, chatId]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Chat Name',
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{marginRight: 10}}>
          <Icon name="users-cog" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      const {chatType, chatId} = route.params;

      console.log('Route ', route.params);

      // Construct the message object
      const message = {
        messageText: inputText.trim(),
        sentBy: currentUserId,
      };

      if (chatType === 'open' || chatType === 'group') {
        // Directly send the message to the garden chatId
        await sendMessage(chatId, message);
      } else {
        // Handle private and group chats as before
        const usedChatId = await manageChatAndSendMessage(
          currentUserId,
          targetUserId,
          inputText,
          chatType,
        );
        if (!chatId) setChatId(usedChatId);
      }

      setInputText(''); // Clear input after successful send
    } catch (error) {
      console.error('Error sending message222:', error);
    }
  };

  // Handle long press on a message to delete it
  const handleLongPress = message => {
    // Check if the current user is the sender of the message
    if (message.sentBy === currentUserId) {
      Alert.alert(
        'Delete Message',
        'Are you sure you want to delete this message?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => deleteMessageHandler(message.id)},
        ],
      );
    } else {
      // Optionally, inform the user they can only delete their own messages
      Alert.alert(
        'Cannot Delete Message',
        'You can only delete messages you sent.',
      );
    }
  };

  // Delete message function
  const deleteMessageHandler = async messageId => {
    try {
      await deleteMessage(chatId, messageId);
      // Optionally, refresh messages or handle UI feedback
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Render message item
  const renderMessageItem = ({item}) => (
    <TouchableWithoutFeedback onLongPress={() => handleLongPress(item)}>
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
    </TouchableWithoutFeedback>
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
      <GroupInfoModal
        chatTypes={['group']}
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        groupData={updatedGroupData} // Pass the state that reflects updates
        onMemberChange={handleMemberChange} // Ensure you implement this prop in GroupInfoModal to handle changes
      />
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
