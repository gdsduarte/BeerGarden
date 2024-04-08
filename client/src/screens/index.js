/**
 * This file is used to export all the screens from the folder into one file.
 * This way, we can import all the screens from the folder using a single import statement.
 */

export {default as LoginScreen} from './customer/Login/LoginScreen';
export {default as HomeScreen} from './customer/Home/HomeScreen';

export {default as ProfileScreen} from './customer/Profile/ProfileScreen';
export {default as UsersProfileScreen} from './customer/Profile/UsersProfileScreen';

// Search Routes
export {default as SearchScreen} from './customer/Search/SearchScreen';

// Register Routes
export {default as SignupSelectionScreen} from './customer/Register/SignupSelectionScreen';
export {default as UserSignUpScreen} from './customer/Register/User/UserSignUpScreen';
export {default as OwnerSignUpScreen} from './customer/Register/Owner/OwnerSignUpScreen';

// Chat Routes
export {default as ChatScreen} from './customer/Chat/ChatScreen';
export {default as SpecificChatScreen} from './customer/Chat/SpecificChatScreen';

// Reservations Routes
export {default as ReservationScreen} from './customer/Bookings/ReservationScreen';
export {default as ReservationDetailsScreen} from './customer/Bookings/ReservationDetailsScreen';

// Pub Routes
export {default as PubScreen} from './customer/Pubs/PubScreen';
export {default as PubDetailsScreen} from './customer/Pubs/PubDetailsScreen';
export {default as PubEventsScreen} from './customer/Pubs/Events/PubEventsScreen';
export {default as PubEventsDetailsScreen} from './customer/Pubs/Events/PubEventsDetailsScreen';
export {default as PubReviewsScreen} from './customer/Pubs/Reviews/PubReviewsScreen';
export {default as ContactScreen} from './customer/Pubs/ContactScreen';
export {default as PubsFinderScreen} from './customer/Pubs/PubsFinderScreen';

// Food Routes
export {default as FoodMenuScreen} from './customer/Pubs/Foods/FoodMenuScreen';
export {default as FoodDetailScreen} from './customer/Pubs/Foods/FoodDetailScreen';
export {default as FoodReviewsScreen} from './customer/Pubs/Foods/FoodReviewsScreen';

// Drinks Routes
export {default as DrinkMenuScreen} from './customer/Pubs/Drinks/DrinkMenuScreen';
export {default as DrinkDetailScreen} from './customer/Pubs/Drinks/DrinkDetailScreen';
export {default as DrinkReviewsScreen} from './customer/Pubs/Drinks/DrinkReviewsScreen';

// Beers Routes
export {default as BeersScreen} from './customer/Beers/BeersScreen';
export {default as BeersDetailsScreen} from './customer/Beers/BeersDetailsScreen';

// Booking Routes
export {default as BookingScreen} from './customer/Pubs/Booking/BookingScreen';
export {default as BookingInputScreen} from './customer/Pubs/Booking/BookingInputScreen';

// Business Routes
export {default as DashboardScreen} from './business/DashboardScreen';
export {default as PubChatScreen} from './business/PubChatScreen';
export {default as PubReservationScreen} from './business/PubReservationScreen';
export {default as PubReservationDetailsScreen} from './business/PubReservationDetailsScreen';
