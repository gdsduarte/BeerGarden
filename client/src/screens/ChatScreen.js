import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Screen</Text>
      <View style={styles.chatContainer}>
        <Text style={styles.chatMessage}>Hello, how can I help you?</Text>
        <Text style={styles.chatMessage}>I'm looking for a beer recommendation.</Text>
        <Text style={styles.chatMessage}>Sure, what type of beer do you like?</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chatContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    height: '60%',
  },
  chatMessage: {
    marginBottom: 10,
  },
});

export default ChatScreen;
