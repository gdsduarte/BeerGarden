/* eslint-disable prettier/prettier */
import {
  HomeScreen,
  LoginScreen,
  ProfileScreen,
  SearchScreen,
  ChatScreen,
  SpecificChatScreen,
  ReservationScreen,
  ReservationDetailsScreen,
  PubDetailsScreen,
  DrinkDetailScreen,
  FoodDetailScreen,
  SignupSelectionScreen,
  UserSignUpScreen,
  OwnerSignUpScreen,
  BookingScreen,
  DrinkMenuScreen,
  FoodMenuScreen,
  PubScreen,
} from '../screens';


// Define screen options (if any) for customization
// Example: const defaultOptions = { headerShown: false };

const screensConfig = {
  // Home Navigator Screens
  Home: {
    component: HomeScreen,
    options: {
      /* HomeScreen options */
    },
  },

  // Login and Profile Navigator Screens
  Login: {
    component: LoginScreen,
    options: {
      /* LoginScreen options */
    },
  },
  Profile: {
    component: ProfileScreen,
    options: {
      /* ProfileScreen options */
    },
  },
  SignupSelection: {
    component: SignupSelectionScreen,
    options: {
      /* SignupSelectionScreen options */
    },
  },
  UserSignUp: {
    component: UserSignUpScreen,
    options: {
      /* UserSignUpScreen options */
    },
  },
  OwnerSignUp: {
    component: OwnerSignUpScreen,
    options: {
      /* OwnerSignUpScreen options */
    },
  },

  // Search Navigator Screens
  Search: {
    component: SearchScreen,
    options: {
      /* SearchScreen options */
    },
  },
  PubDetails: {
    component: PubDetailsScreen,
    options: {
      /* PubDetailsScreen options */
    },
  },

  // Chat Navigator Screens
  Chat: {
    component: ChatScreen,
    options: {
      /* ChatScreen options */
    },
  },
  SpecificChat: {
    component: SpecificChatScreen,
    options: {
      /* SpecificChatScreen options */
    },
  },

  // Booking Navigator Screens
  Booking: {
    component: BookingScreen,
    options: {
      /* BookingScreen options */
    },
  },
  Reservation: {
    component: ReservationScreen,
    options: {
      /* ReservationScreen options */
    },
  },
  ReservationDetails: {
    component: ReservationDetailsScreen,
    options: {
      /* ReservationDetailsScreen options */
    },
  },

  // Drink Navigator Screens
  DrinkDetail: {
    component: DrinkDetailScreen,
    options: {
      /* DrinkDetailScreen options */
    },
  },
  DrinkMenu: {
    component: DrinkMenuScreen,
    options: {
      /* DrinkMenuScreen options */
    },
  },

  // Food Navigator Screens
  FoodDetail: {
    component: FoodDetailScreen,
    options: {
      /* FoodDetailScreen options */
    },
  },
  FoodMenu: {
    component: FoodMenuScreen,
    options: {
      /* FoodMenuScreen options */
    },
  },

  // Pub Navigator Screens
  Pub: {
    component: PubScreen,
    options: {
      /* PubScreen options */
    },
  },

  // Add additional screens and configurations as needed
};

export default screensConfig;


/* import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { screensConfig } from './navigationConfig'; // Adjust the path as necessary

const Stack = createStackNavigator();

const BookingNavigator = () => {
  return (
    <Stack.Navigator>
      {Object.entries(screensConfig)
        // Assuming each key in screensConfig is exactly matching your screen names used in the navigator
        .filter(([key]) => ['ReservationScreen', 'ReservationDetailsScreen', 'SpecificChatScreen'].includes(key))
        .map(([name, { component, options }]) => (
          <Stack.Screen name={name} component={component} options={options} key={name} />
        ))}
    </Stack.Navigator>
  );
};

export default BookingNavigator; */

