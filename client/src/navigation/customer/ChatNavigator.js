import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ChatScreen, SpecificChatScreen} from '@screens';

const Stack = createStackNavigator();

function ChatNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatScreen} options={{headerTitle: 'Chats'}} />
      <Stack.Screen name="SpecificChat" component={SpecificChatScreen} />
    </Stack.Navigator>
  );
}

export default ChatNavigator;
