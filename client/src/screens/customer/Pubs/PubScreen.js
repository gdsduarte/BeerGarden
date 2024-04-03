import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {usePubDetails} from '@hooks';
import {PubNavigator} from '@navigation';
import {
  FoodMenuScreen,
  DrinkMenuScreen,
  BookingScreen,
  ContactScreen,
} from '@screens';
import Loading from '@components/common/Loading';

const Drawer = createDrawerNavigator();

const PubScreen = ({route}) => {
  const {pubId} = route.params;
  const {pub, loading, error} = usePubDetails(pubId);
  const navigation = useNavigation();

  if (loading) {
    return <Loading />;
  }
  
  if (error || !pub) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>We're sorry, the requested pub could not be found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <Drawer.Navigator
      initialRouteName="Details"
      screenOptions={{
        headerShown: true,
        headerTitle: pub.displayName,
        drawerStyle: {
          backgroundColor: '#f8f1e7',
          width: '40%',
        },
        //drawerType: 'slide',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      }}>
      <Drawer.Screen name="Details">
        {() => <PubNavigator pubId={pubId} />}
      </Drawer.Screen>
      <Drawer.Screen name="Menu">
        {() => <FoodMenuScreen pubId={pubId} image={pub.photoUrl} />}
      </Drawer.Screen>
      <Drawer.Screen name="Drinks">
        {() => <DrinkMenuScreen pubId={pubId} image={pub.photoUrl} />}
      </Drawer.Screen>
      <Drawer.Screen name="Booking">
        {() => <BookingScreen pubId={pubId} />}
      </Drawer.Screen>
      <Drawer.Screen name="Contact">
        {() => <ContactScreen pubId={pubId} />}
      </Drawer.Screen>
    </Drawer.Navigator>
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
  headerButton: {
    paddingHorizontal: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  goBackButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  goBackButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },  
});

export default PubScreen;
