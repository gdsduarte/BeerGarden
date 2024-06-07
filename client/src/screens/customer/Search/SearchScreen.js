/**
 * SearchScreen is a screen that displays a map with markers for nearby pubs and a carousel of nearby pubs.
 * The user can search for locations, view nearby pubs, and navigate to a pub's screen.
 * The user can view the pub's screen by tapping on a marker or carousel item.
 * The user can swipe up on the carousel to view a modal with more information about the pub.
 * The user can tap on the "My Location" button to navigate to their current location.
 * The user can tap on the "Search for locations..." input to search for locations.
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {Marker} from 'react-native-maps';
import Loading from '@components/common/Loading';
import {useUserLocation, useNearbyPubs} from '@hooks';
import {getDistance} from 'geolib';
import {fetchPubsNearLocation} from '../../../hooks/customer/useNearbyPubs';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import SearchModal from '@components/search/SearchModal';
import Config from 'react-native-config';

const apiKey = Config.MAPS_API_KEY;

const SearchScreen = ({navigation}) => {
  const userLocation = useUserLocation();
  const {pubs, loading} = useNearbyPubs(
    userLocation.location?.latitude,
    userLocation.location?.longitude,
    10,
  );
  const [sortedPubs, setSortedPubs] = useState([]);
  const mapRef = useRef(null);
  const carouselRef = useRef(null);
  const [selectedPubId, setSelectedPubId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentRegion, setCurrentRegion] = useState(null);
  const autocompleteRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Sort the pubs by distance from the user's location
  useEffect(() => {
    if (userLocation.location && pubs.length) {
      const sorted = sortPubsByDistance(pubs, userLocation.location);
      setSortedPubs(sorted);
      setSelectedPubId(sorted[0].id);
    }
  }, [pubs, userLocation.location]);

  // Check if the user is within 100m of a pub and clear the search query
  useEffect(() => {
    if (userLocation.location && currentRegion) {
      const distance = getDistance(
        {latitude: currentRegion.latitude, longitude: currentRegion.longitude},
        {
          latitude: userLocation.location.latitude,
          longitude: userLocation.location.longitude,
        },
      );

      if (distance < 100) {
        setSearchQuery('');
      }
    }
  }, [currentRegion, userLocation.location]);

  // Sort the pubs by distance from the user's location
  const sortPubsByDistance = (pubs, userLocation) => {
    return pubs.sort((a, b) => {
      return (
        getDistance(
          {latitude: a.latitude, longitude: a.longitude},
          userLocation,
        ) -
        getDistance(
          {latitude: b.latitude, longitude: b.longitude},
          userLocation,
        )
      );
    });
  };

  // Handle the marker press event
  const handleMarkerPress = pub => {
    const index = sortedPubs.findIndex(p => p.id === pub.id);
    setSelectedPubId(pub.id);
    carouselRef.current?.snapToItem(index);
  };

  // Handle the carousel snap to item event
  const handleSnapToItem = index => {
    const selectedPub = sortedPubs[index];
    setSelectedPubId(selectedPub.id);
    mapRef.current?.animateToRegion({
      latitude: selectedPub.latitude,
      longitude: selectedPub.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.01,
    });
  };

  // Update the user location on the map and fetch pubs near the user's location
  const updateToUserLocation = () => {
    if (userLocation.location) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.location.latitude,
        longitude: userLocation.location.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.01,
      });

      fetchPubsNearLocation(
        userLocation.location.latitude,
        userLocation.location.longitude,
        10,
      ).then(newPubs => {
        const sortedNewPubs = sortPubsByDistance(
          newPubs,
          userLocation.location,
        );
        setSortedPubs(sortedNewPubs);
        if (sortedNewPubs.length > 0) {
          setSelectedPubId(sortedNewPubs[0].id);
        } else {
          setSelectedPubId(null);
        }
        setSelectedLocation(userLocation.location);
      });
    }
  };

  if (loading || !userLocation.location) {
    return <Loading />;
  }

  return (
    <GestureHandlerRootView style={styles.fullscreen}>
      <GooglePlacesAutocomplete
        placeholder="Search for locations..."
        value={searchQuery}
        ref={autocompleteRef}
        onChangeText={setSearchQuery}
        renderRightButton={() =>
          searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{fontSize: 20, color: '#000'}}>X</Text>
            </TouchableOpacity>
          ) : null
        }
        query={{
          key: apiKey,
          language: 'en',
        }}
        fetchDetails
        styles={{
          textInputContainer: styles.searchBar,
          listView: styles.listView,
        }}
      />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.location?.latitude || 0,
          longitude: userLocation.location?.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        onRegionChangeComplete={region => setCurrentRegion(region)}>
        {selectedLocation && (
          <Marker coordinate={selectedLocation} pinColor="green" />
        )}
        {sortedPubs.map((pub, index) => (
          <Marker
            key={`${pub.id}-${
              selectedPubId === pub.id ? 'selected' : 'not-selected'
            }`}
            coordinate={{latitude: pub.latitude, longitude: pub.longitude}}
            pinColor={pub.id === selectedPubId ? 'blue' : 'red'}
            title={pub.id === selectedPubId ? pub.name : ''}
            onPress={() => handleMarkerPress(pub)}
          />
        ))}
      </MapView>
      <TouchableOpacity
        style={styles.location}
        onPress={() => {
          if (userLocation.location) {
            mapRef.current.animateToRegion(
              {
                latitude: userLocation.location.latitude,
                longitude: userLocation.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              1000,
            );
            autocompleteRef.current?.setAddressText('');
            updateToUserLocation();
          }
        }}>
        <Text style={{fontSize: 16}}>My Location</Text>
      </TouchableOpacity>
      <View style={styles.carouselContainer}>
        <PanGestureHandler
          onGestureEvent={event => {
            if (event.nativeEvent.translationY < -100) {
              setIsModalVisible(true);
            }
          }}>
          <View style={styles.swipeUpBar}>
            <Text style={styles.swipeUpBarText}>Swipe up for more</Text>
          </View>
        </PanGestureHandler>
        <Carousel
          ref={carouselRef}
          data={sortedPubs}
          onSnapToItem={handleSnapToItem}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('PubScreen', {pubId: item.id})
              }>
              <Image source={{uri: item.image}} style={styles.cardImage} />
              <Text style={styles.cardText}>{item.name}</Text>
              <Text style={styles.cardText}>{`${item.distance.toFixed(
                1,
              )} km`}</Text>
            </TouchableOpacity>
          )}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width - 100}
          containerCustomStyle={styles.carousel}
          inactiveSlideScale={0.95}
          inactiveSlideOpacity={0.7}
          layout="default"
          loop={true}
        />
      </View>
      <SearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        pubs={sortedPubs}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  location: {
    position: 'absolute',
    top: 120,
    right: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    zIndex: 20,
  },
  swipeUpBar: {
    alignSelf: 'center',
    height: 20,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#355E3B',
    borderRadius: 20,
  },
  swipeUpBarText: {
    color: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
    marginTop: -200,
  },
  fullscreen: {
    flex: 1,
    position: 'relative',
  },
  searchBar: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    zIndex: 10,
  },
  listView: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  carouselContainer: {
    position: 'absolute',
    bottom: 0,
    //backgroundColor: '#f8f1e7',
  },
  carousel: {
    flexGrow: 0,
    height: 200,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  cardText: {
    marginTop: 5,
    fontWeight: 'bold',
  },
});

export default SearchScreen;
