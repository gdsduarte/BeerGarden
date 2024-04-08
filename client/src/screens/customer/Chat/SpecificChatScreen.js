/**
 * A screen to display a specific chat between two users or a group chat.
 * This screen is used to send and receive messages in a chat.
 * It also allows the user to delete their own messages.
 */

import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
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
  const {
    targetUserId,
    chatId: initialChatId,
    groupData: initialGroupData,
  } = route.params;
  const {currentUserId} = useContext(AuthContext);
  const [chatId, setChatId] = useState(initialChatId);
  const [inputText, setInputText] = useState('');
  const {messages} = useChatMessages(chatId);
  const flatListRef = useRef();
  const [isModalVisible, setModalVisible] = useState(false);
  const [updatedGroupData, setUpdatedGroupData] = useState(initialGroupData);

  console.log('Route params:', route.params);

  // Handle member change in group chat
  const handleMemberChange = updatedMemberIds => {
    setUpdatedGroupData(prevData => ({
      ...prevData,
      members: updatedMemberIds,
    }));
  };

  // Find the chatId if it doesn't exist
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

  // Update the header title and options based on the chat type
  useEffect(() => {
    const {chatType, displayName} = route.params;
    navigation.setOptions({
      headerShown: true,
      title: displayName || 'Chat',
      headerRight: () =>
        chatType === 'group' ? (
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{marginRight: 10}}>
            <Icon name="users-cog" size={24} color="#000" />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, route.params]);
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      const {chatType, chatId} = route.params;

      const message = {
        messageText: inputText.trim(),
        sentBy: currentUserId,
      };

      if (chatType === 'open' || chatType === 'group') {
        // Directly send the message to the garden or group chat
        await sendMessage(chatId, message, chatType);
      } else {
        // Manage the chat and send the message to the user
        const usedChatId = await manageChatAndSendMessage(
          currentUserId,
          targetUserId,
          inputText,
          chatType,
        );
        if (!chatId) setChatId(usedChatId);
      }

      setInputText('');
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
        /* onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()} */
        inverted
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
        groupData={updatedGroupData}
        onMemberChange={handleMemberChange}
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
