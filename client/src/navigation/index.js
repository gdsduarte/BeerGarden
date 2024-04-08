/**
 * This file is used to export all the navigators from the folder into one file.
 * This way, we can import all the navigators from the folder using a single import statement.
 */

// Customer hooks for fetching data from Firestore
export {default as BookingNavigator} from './customer/BookingNavigator';
export {default as BottomTabNavigator} from './customer/BottomTabNavigator';
export {default as ChatNavigator} from './customer/ChatNavigator';
export {default as DrinkNavigator} from './customer/DrinkNavigator';
export {default as HomeNavigator} from './customer/HomeNavigator';
export {default as LoginNavigator} from './customer/LoginNavigator';
export {default as FoodNavigator} from './customer/FoodNavigator';
export {default as ProfileNavigator} from './customer/ProfileNavigator';
export {default as PubNavigator} from './customer/PubNavigator';
export {default as SearchNavigator} from './customer/SearchNavigator';

// Business hooks for fetching data from Firestore
export {default as OwnerBottomTabNavigator} from './business/OwnerBottomTabNavigator';
export {default as PubChatNavigator} from './business/PubChatNavigator';
export {default as PubBookingNavigator} from './business/PubBookingNavigator';
