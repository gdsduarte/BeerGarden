import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  Modal,
  FlatList,
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


  useEffect(() => {
    if (userLocation.location && pubs.length) {
      const sorted = sortPubsByDistance(pubs, userLocation.location);
      setSortedPubs(sorted);
      setSelectedPubId(sorted[0].id);
    }
  }, [pubs, userLocation.location]);

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

  const handleMarkerPress = pub => {
    const index = sortedPubs.findIndex(p => p.id === pub.id);
    setSelectedPubId(pub.id);
    carouselRef.current?.snapToItem(index);
  };

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

  // update the user location on the map and fetch pubs near the user's location
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
        onPress={async (data, details = null) => {
          if (details) {
            const lat = details.geometry.location.lat;
            const lng = details.geometry.location.lng;

            mapRef.current?.animateToRegion({
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.001,
              longitudeDelta: 0.01,
            });

            // Update selected location state
            setSelectedLocation({latitude: lat, longitude: lng});

            // Fetch pubs near the user's current location
            fetchPubsNearLocation(lat, lng, 10).then(newPubs => {
              const sortedNewPubs = sortPubsByDistance(newPubs, {
                latitude: lat,
                longitude: lng,
              });
              setSortedPubs(sortedNewPubs);
              if (sortedNewPubs.length > 0) {
                setSelectedPubId(sortedNewPubs[0].id);
              } else {
                setSelectedPubId(null);
              }
              // Update selected location state to reflect this change
              setSelectedLocation({latitude, longitude});
            });
          }
        }}
        query={{
          key: 'AIzaSyBD7oKnn0RnM2Xid3UXvEKq2FnbtrCSRcE',
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
        style={{
          position: 'absolute',
          // Adjust the position according to your layout
          top: 70,
          right: 10,
          padding: 10,
          backgroundColor: '#fff',
          borderRadius: 20,
          zIndex: 20, // Ensure it's above other map elements
        }}
        onPress={() => {
          if (userLocation.location) {
            // Center the map on the user's location
            mapRef.current.animateToRegion(
              {
                latitude: userLocation.location.latitude,
                longitude: userLocation.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              1000,
            ); // Animated transition to the user's location

            // Clear the search input
            autocompleteRef.current?.setAddressText('');

            // Fetch and display pubs near the user's location
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
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}>
        <View style={{marginTop: 22}}>
          <View>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={{padding: 10}}>
              <Text>Close</Text>
            </TouchableOpacity>
            <FlatList
              data={sortedPubs.filter(pub =>
                pub.name.toLowerCase().includes(searchQuery.toLowerCase()),
              )}
              keyExtractor={item => item.id.toString()}
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
            />
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  swipeUpBar: {
    alignSelf: 'center',
    height: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  swipeUpBarText: {
    color: '#000',
  },
  map: {
    width: '100%',
    height: '100%',
    marginTop: -100,
  },
  fullscreen: {
    flex: 1,
    position: 'relative',
  },
  searchBar: {
    position: 'absolute',
    top: 20,
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
