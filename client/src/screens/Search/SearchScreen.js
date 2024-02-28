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
import Loading from '../../components/common/Loading';
import {useUserLocation, useNearbyPubs} from '../../hooks';
import {getDistance} from 'geolib';

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

  useEffect(() => {
    if (userLocation.location && pubs.length) {
      const sorted = sortPubsByDistance(pubs, userLocation.location);
      setSortedPubs(sorted);
      setSelectedPubId(sorted[0].id); // Set the closest pub as selected
    }
  }, [pubs, userLocation.location]);

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
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  if (loading || !userLocation.location) {
    return <Loading />;
  }

  return (
    <View style={styles.fullscreen}>
      <GooglePlacesAutocomplete
        placeholder="Search for pubs..."
        onPress={(data, details = null) => {
          mapRef.current?.animateToRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
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
          latitude: userLocation.location.latitude,
          longitude: userLocation.location.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}>
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
      <View style={styles.carouselContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
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
    height: 220,
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
    height: 150,
    borderRadius: 10,
  },
  cardText: {
    marginTop: 5,
    fontWeight: 'bold',
  },
});

export default SearchScreen;
