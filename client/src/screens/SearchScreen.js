import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MapView, {Marker} from 'react-native-maps';
import usePubs from '../hooks/usePubs';
import useUserLocation from '../hooks/useUserLocation';
import useNearbyPubs from '../hooks/useNearbyPubs';
import Slider from '@react-native-community/slider';

const Tab = createMaterialTopTabNavigator();

// Dummy data
const beersData = [
  {id: 'b1', name: 'Summer Ale', image: 'https://example.com/beer1.jpg'},
  {id: 'b2', name: 'Winter Lager', image: 'https://example.com/beer2.jpg'},
];

const SearchBar = ({placeholder, onSearch}) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => onSearch(searchTerm)}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const SearchCategory = ({placeholder, data}) => (
  <View style={styles.container}>
    <SearchBar
      placeholder={placeholder}
      onSearch={term => console.log(`Search ${placeholder}:`, term)}
    />
    <SearchResultList data={data} />
  </View>
);

const SearchResultList = ({data}) => (
  <FlatList
    data={data}
    renderItem={({item}) => <Card item={item} />}
    keyExtractor={item => item.id}
  />
);

const NearMeSearch = ({navigation}) => {
  const [searchRadius, setSearchRadius] = useState(5);
  const userLocation = useUserLocation();
  const {pubs, loading} = useNearbyPubs(
    userLocation.location ? userLocation.location.latitude : null,
    userLocation.location ? userLocation.location.longitude : null,
    searchRadius,
  );

  if (loading || !userLocation.location) {
    return <Text>Loading...</Text>;
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
      <Text>Search Radius: {searchRadius.toFixed(1)} km</Text>
      <FlatList
        data={pubs}
        renderItem={({item}) => (
          <Card
            item={item}
            onPress={() =>
              navigation.navigate('PubDetailsScreen', {pubId: item.id})
            }
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
    return <Text>Loading...</Text>;
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

const Card = ({item, onPress}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{uri: item.image}} style={styles.cardImage} />
    <Text style={styles.cardText}>{item.name}</Text>
  </TouchableOpacity>
);

const SearchScreen = () => {
  return (
    <Tab.Navigator screenOptions={{tabBarStyle: styles.tabBar}}>
      <Tab.Screen name="Near Me" component={NearMeSearch} />
      <Tab.Screen name="Places" component={PlacesSearch} />
      <Tab.Screen
        name="Beers"
        children={() => (
          <SearchCategory placeholder="Search for beers..." data={beersData} />
        )}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f1e7',
  },
  searchContainer: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#673AB7',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
  searchButton: {
    backgroundColor: '#8B4513',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  cardText: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  cardList: {
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
});

export default SearchScreen;
