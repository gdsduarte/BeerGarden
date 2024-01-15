import React from 'react';
import {
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import usePubDetails from '../hooks/usePubDetails';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Example screens for the drawer
const MenuScreen = () => <Text>Menu Screen</Text>;
const BookingScreen = () => <Text>Booking Screen</Text>;
const ContactScreen = () => <Text>Contact Screen</Text>;
const ReviewsScreen = () => <Text>Reviews</Text>;

const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

const PubDetailsTabNavigator = ({pub}) => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Details"
        children={() => <PubDetailsContent pub={pub} />}
      />
      <Tab.Screen name="Reviews" component={ReviewsScreen} />
    </Tab.Navigator>
  );
};

const PubDetailsContent = ({pub}) => (
  <ScrollView style={styles.container}>
    <Image source={{uri: pub.photoUrl}} style={styles.image} />
    <Text style={styles.name}>{pub.displayName}</Text>
    <Text style={styles.description}>{pub.description}</Text>
  </ScrollView>
);

const PubDetailsScreen = ({route}) => {
  const {pubId} = route.params;
  const {pub, loading} = usePubDetails(pubId);
  const navigation = useNavigation();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!pub) {
    return <Text>Pub not found.</Text>;
  }

  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator
        initialRouteName="Details"
        screenOptions={{
          headerShown: true,
          headerTitle: pub.displayName,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{paddingHorizontal: 10}}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}>
        <Drawer.Screen name="Details">
          {() => <PubDetailsTabNavigator pub={pub} />}
        </Drawer.Screen>
        <Drawer.Screen name="Menu" component={MenuScreen} />
        <Drawer.Screen name="Booking" component={BookingScreen} />
        <Drawer.Screen name="Contact" component={ContactScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f1e7',
  },
  image: {
    width: '100%',
    height: 200,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
  },
  description: {
    fontSize: 16,
    padding: 10,
  },
  // Add more styles as needed
});

export default PubDetailsScreen;
