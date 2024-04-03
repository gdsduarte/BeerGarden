/**
 * Note: This file is NOT used in the project. It is for future implementations!!
 * 
 * Navigation Configuration is a central place to define all the screens and their configurations.
 * The configuration includes the screen component and its options.
 * The configuration can be used to generate the navigation stack for the application.
 * The configuration can be used to navigate between screens and pass parameters.
 * The configuration can be used to define the screen navigation guards and permissions.
 */

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
} from '@screens';


const defaultOptions = { headerShown: false };

const screensConfig = {
  // Home Navigator Screens
  Home: {
    component: HomeScreen,
    options: {
      defaultOptions: defaultOptions
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
