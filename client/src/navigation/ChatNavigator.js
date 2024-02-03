import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ChatScreen, SpecificChatScreen} from '../screens';

const Stack = createStackNavigator();

function ChatNavigator({navigation}) {
  React.useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('state', e => {
      const routeName = e.data.state?.routes[e.data.state.index]?.name;
      const showTabBar = routeName !== 'SpecificChat';

      navigation.setOptions({tabBarVisible: showTabBar});
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatScreen} options={{headerTitle: 'Chats'}} />
      <Stack.Screen name="SpecificChat" component={SpecificChatScreen} />
    </Stack.Navigator>
  );
}

export default ChatNavigator;
