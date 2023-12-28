/* eslint-disable prettier/prettier */
import { Alert } from 'react-native';

export const navigateWithAlert = (navigation, routeName, alertMessage) => {
  Alert.alert(
    'Notice',
    alertMessage,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => navigation.navigate(routeName),
      },
    ],
    { cancelable: false }
  );
};
