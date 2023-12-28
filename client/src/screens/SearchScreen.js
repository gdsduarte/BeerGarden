import React, {useState} from 'react';
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

const Tab = createMaterialTopTabNavigator();

// Dummy data
const nearbyPubs = [
  {id: 'pub1', name: 'Pub 1', latitude: 37.78925, longitude: -122.4314},
  {id: 'pub2', name: 'Pub 2', latitude: 37.78825, longitude: -122.4324},
  {id: 'pub3', name: 'Pub 3', latitude: 37.78725, longitude: -122.4334},
  {id: 'pub4', name: 'Pub 4', latitude: 37.78625, longitude: -122.4344},
  {id: 'pub5', name: 'Pub 5', latitude: 37.78525, longitude: -122.4354},
];

const placesData = [
  {id: 'p1', name: 'Green Park', image: 'https://example.com/place1.jpg'},
  {id: 'p2', name: 'The Ale House', image: 'https://example.com/place2.jpg'},
  {id: 'p3', name: 'The Brewery', image: 'https://example.com/place3.jpg'},
  {id: 'p4', name: 'The Tap House', image: 'https://example.com/place4.jpg'},
];

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

const NearMeSearch = () => {
  const [region, setRegion] = useState({
    latitude: 53.350140,
    longitude: -6.266155,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return (
    <View style={styles.mapContainer}>
      <MapView style={styles.map} region={region} onRegionChange={setRegion}>
        {nearbyPubs.map(pub => (
          <Marker
            key={pub.id}
            coordinate={{latitude: pub.latitude, longitude: pub.longitude}}
            title={pub.name}
          />
        ))}
      </MapView>
      <FlatList
        data={nearbyPubs}
        renderItem={({item}) => <Card item={item} />}
        keyExtractor={item => item.id}
        style={styles.cardList}
      />
    </View>
  );
};

const Card = ({item}) => (
  <View style={styles.card}>
    <Image source={{uri: item.image}} style={styles.cardImage} />
    <Text style={styles.cardText}>{item.name}</Text>
  </View>
);

const SearchScreen = () => {
  return (
    <Tab.Navigator screenOptions={{tabBarStyle: styles.tabBar}}>
      <Tab.Screen name="Near Me" component={NearMeSearch} />
      <Tab.Screen
        name="Places"
        children={() => (
          <SearchCategory
            placeholder="Search for places..."
            data={placesData}
          />
        )}
      />
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
});

export default SearchScreen;
