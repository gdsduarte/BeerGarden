import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MapView, {Marker} from 'react-native-maps';
import usePubs from '../../hooks/usePubs';
import useUserLocation from '../../hooks/useUserLocation';
import useNearbyPubs from '../../hooks/useNearbyPubs';
import useAllMenuItems from '../../hooks/useAllMenuItems';
import Slider from '@react-native-community/slider';
import SearchBar from '../../components/common/SearchBar';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';


const Tab = createMaterialTopTabNavigator();

const NearMeSearch = ({navigation}) => {
  const [searchRadius, setSearchRadius] = useState(5);
  const userLocation = useUserLocation();
  const {pubs, loading} = useNearbyPubs(
    userLocation.location ? userLocation.location.latitude : null,
    userLocation.location ? userLocation.location.longitude : null,
    searchRadius,
  );

  if (loading || !userLocation.location) {
    return <Loading />;
  }

  if (userLocation.error) {
    return <Text>Error fetching location</Text>;
  }

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        region={{
          latitude: userLocation.location.latitude,
          longitude: userLocation.location.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}>
        {pubs.map(pub => (
          <Marker
            key={pub.id}
            coordinate={{latitude: pub.latitude, longitude: pub.longitude}}
            title={pub.name}
          />
        ))}
      </MapView>
      <Slider
        style={styles.slider}
        minimumValue={0.1}
        maximumValue={10}
        step={0.1}
        value={searchRadius}
        onValueChange={value => setSearchRadius(value)}
      />
      <Text style={styles.radius}>
        Search Radius: {searchRadius.toFixed(1)} km
      </Text>
      <FlatList
        data={pubs}
        renderItem={({item}) => (
          <Card
            item={item}
            onPress={() => navigation.navigate('PubScreen', {pubId: item.id})}
          />
        )}
        keyExtractor={item => item.id}
        style={styles.cardList}
      />
    </View>
  );
};

const PlacesSearch = () => {
  const {pubs, loading} = usePubs();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPubs = pubs.filter(pub =>
    pub.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <SearchBar placeholder="Search for places..." onSearch={setSearchTerm} />
      <FlatList
        data={filteredPubs}
        renderItem={({item}) => <Card item={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const GoodiesSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const {menuItems, loading} = useAllMenuItems(searchTerm);

  // Assuming you want to perform the search when the user triggers onSearch
  const handleSearch = term => {
    setSearchTerm(term);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <SearchBar placeholder="Search for goodies..." onSearch={handleSearch} />
      <FlatList
        data={menuItems} // Using the menuItems directly from the hook
        renderItem={({item}) => <Card item={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const SearchScreen = () => {
  return (
    <Tab.Navigator screenOptions={{tabBarStyle: styles.tabBar}}>
      <Tab.Screen name="Nearby" component={NearMeSearch} />
      <Tab.Screen name="Places" component={PlacesSearch} />
      <Tab.Screen name="Goodies" component={GoodiesSearch} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  radius: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f1e7',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: 200,
  },
  slider: {
    width: '80%',
    alignSelf: 'center',
  },
  cardList: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f1e7',
  },
});

export default SearchScreen;
