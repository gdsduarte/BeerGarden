import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {PubChatScreen, SpecificChatScreen} from '@screens';

const Stack = createStackNavigator();

function PubChatNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={PubChatScreen} options={{headerTitle: 'Chats'}} />
      <Stack.Screen name="SpecificChat" component={SpecificChatScreen} />
    </Stack.Navigator>
  );
}

export default PubChatNavigator;
