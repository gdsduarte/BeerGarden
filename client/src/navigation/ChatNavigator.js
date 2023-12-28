import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '../screens/ChatScreen';
import SpecificChatScreen from '../screens/SpecificChatScreen';
// ... other imports

const Stack = createStackNavigator();

function ChatNavigator({ navigation }) {
  React.useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      // Check if SpecificChatScreen is the current screen
      const routeName = e.data.state?.routes[e.data.state.index]?.name;
      const showTabBar = (routeName !== 'SpecificChat');

      navigation.setOptions({ tabBarVisible: showTabBar });
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="SpecificChat" component={SpecificChatScreen} />
    </Stack.Navigator>
  );
}

export default ChatNavigator;
