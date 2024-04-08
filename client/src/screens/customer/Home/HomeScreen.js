/**
 * HomeScreen is the screen for the home page of the application.
 * It displays premium events, featured pubs, featured beers, and upcoming bookings.
 * The user can search for pubs, events, and beers using the search bar.
 * The user can navigate to the pub screen, event screen, beer screen, and reservation details screen.
 * The user can also navigate to the finder screen to search for pubs, events, and beers on the more buttons
 */

import React, {useState, useContext} from 'react';
import {StatusBar} from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AuthContext from '@contexts/AuthContext';
import {
  useEvents,
  useFeaturedPubs,
  useFeaturedBeers,
  useReservations,
  useRecentPubs,
} from '@hooks';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {currentUserId} = useContext(AuthContext);
  const {events: premiumEvents, loadingEvents: loadingPremiumEvents} =
    useEvents(true);
  const {events: allEvents, loadingEvents: loadingAllEvents} = useEvents();
  const {featuredPubs, loadingPubs} = useFeaturedPubs();
  const {featuredBeers, loadingBeers} = useFeaturedBeers();
  const [reservations, loading] = useReservations(currentUserId);
  const {recentPubs, loadingRecentPubs} = useRecentPubs();
  const [searchBarBackground, setSearchBarBackground] = useState('transparent');
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollY = new Animated.Value(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter bookings by status
  const relevantBookings = reservations.filter(
    booking => booking.status !== 'completed',
  );

  // Interpolate background color
  const backgroundColor = scrollY.interpolate({
    inputRange: [0, 150, 300],
    outputRange: ['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)', 'white'],
    extrapolate: 'clamp',
  });

  const handleScroll = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    // Manually update the scrollY Animated.Value
    scrollY.setValue(yOffset);
    // Conditionally set the searchBarBackground state based on yOffset
    if (yOffset > 300) {
      setSearchBarBackground('white');
    } else {
      setSearchBarBackground('transparent');
    }
  };

  // Set the status bar style on screen focus
  useFocusEffect(
    React.useCallback(() => {
      const setStatusBarStyle = () => {
        StatusBar.setBarStyle('light-content', true);
      };
      setStatusBarStyle();
      return () => {
        StatusBar.setBarStyle('dark-content', true);
      };
    }, []),
  );

  // Pagination component for carousel
  const pagination = () => {
    return (
      <Pagination
        dotsLength={premiumEvents.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          paddingVertical: 8,
          marginTop: '-9%',
        }}
        dotStyle={{
          width: 50,
          height: 5,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        inactiveDotStyle={{
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          width: 40,
          height: 4,
          borderRadius: 4,
          marginHorizontal: 6,
        }}
        inactiveDotScale={0.6}
      />
    );
  };

  // Function to render each event item in the carousel
  const renderEvents = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('PubEventsDetails', {eventId: item.id})
      }>
      <View style={styles.eventItem}>
        <Image source={{uri: item.eventImage}} style={styles.eventImage} />
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  // Function to render each feature pubs.
  const renderFeaturedPub = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('PubScreen', {pubId: item.id})}>
      <View style={styles.pubItem}>
        <Image source={{uri: item.photoUrl}} style={styles.pubImage} />
        <Text style={styles.pubName}>{item.displayName}</Text>
      </View>
    </TouchableOpacity>
  );

  // Function to render each feature beer.
  const renderFeaturedBeer = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('BeersDetailsScreen', {beerId: item.id})
      }>
      <View style={styles.beerItem}>
        <Image source={{uri: item.image}} style={styles.beerImage} />
        <Text style={styles.beerName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  // Function to render each booking item
  const renderBooking = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ReservationDetailsScreen', {
          booking: item,
        })
      }>
      <View style={styles.bookingItem}>
        <Image source={{uri: item.pubAvatar}} style={styles.bookingThumbnail} />
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingName}>{item.pubName}</Text>
          <Text style={styles.bookingDetails}>
            {item.date.toDateString()} at {item.date.toLocaleTimeString()}
          </Text>
          <Text style={styles.bookingStatus}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Function to render each new pubs added to the platform
  const renderDiscover = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('PubScreen', {pubId: item.id})}>
      <View style={styles.pubItem}>
        <Image source={{uri: item.photoUrl}} style={styles.pubImage} />
        <Text style={styles.pubName}>{item.displayName}</Text>
      </View>
    </TouchableOpacity>
  );

  // Function to render each promotion or event
  const renderPromotion = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('PubScreen', {
          pubId: item.pubId,
          screen: 'Details',
          params: {
            screen: 'PubEvents',
          },
        })
      }>
      <View style={styles.promotionItem}>
        <Image source={{uri: item.eventImage}} style={styles.promotionImage} />
        <Text style={styles.promotionName}>{item.eventName}</Text>
        <Text style={styles.promotionDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  // Function to handle search submission
  const handleSearchSubmit = () => {
    navigation.navigate('PubsFinderScreen', {searchQuery});
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={
          searchBarBackground === 'white' ? 'dark-content' : 'light-content'
        }
      />
      <Animated.View style={[styles.searchBar, {backgroundColor}]}>
        <Icon
          name="search"
          size={20}
          color={searchBarBackground === 'white' ? 'black' : 'white'}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search for pubs, events, beers..."
          placeholderTextColor={
            searchBarBackground === 'white' ? 'black' : 'white'
          }
          style={[
            styles.searchInput,
            {
              color: searchBarBackground === 'white' ? 'black' : 'white',
              borderColor: searchBarBackground === 'white' ? '#ccc' : 'white',
            },
          ]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
        />
      </Animated.View>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        {/* Event Section */}
        {loadingPremiumEvents ? (
          <Text>Loading events...</Text>
        ) : (
          <Carousel
            data={premiumEvents}
            renderItem={renderEvents}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width}
            onSnapToItem={index => setActiveSlide(index)}
            loop={true}
            /* autoplay={true}
            autoplayDelay={500}
            autoplayInterval={3000} */
            inactiveSlideOpacity={1}
            inactiveSlideScale={1}
            scrollInterpolator={undefined}
            slideInterpolatedStyle={undefined}
            useScrollView={true}
          />
        )}
        {pagination()}
        {/* Featured Pubs Section */}
        <View style={styles.bookingsHeader}>
          <Text style={styles.sectionTitle}>Featured Pubs</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PubsFinderScreen', {
                searchQuery: '',
                filter: 'pubs',
              })
            }>
            <Text style={styles.moreButton}>More</Text>
          </TouchableOpacity>
        </View>
        {loadingPubs ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            horizontal
            data={featuredPubs}
            renderItem={renderFeaturedPub}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            style={styles.featuredPubs}
          />
        )}
        {/* Featured Beers Section */}
        <View style={styles.bookingsHeader}>
          <Text style={styles.sectionTitle}>Featured Beers</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PubsFinderScreen', {
                searchQuery: '',
                filter: 'beers',
              })
            }>
            <Text style={styles.moreButton}>More</Text>
          </TouchableOpacity>
        </View>
        {loadingBeers ? (
          <Text>Loading featured beers...</Text>
        ) : (
          <FlatList
            horizontal
            data={featuredBeers}
            renderItem={renderFeaturedBeer}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.featuredPubs}
          />
        )}
        {/* Bookings Section */}
        <View style={styles.bookingsHeader}>
          <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
          <TouchableOpacity onPress={handleSearchSubmit}>
            <Text style={styles.moreButton}>More</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <Text>Loading bookings...</Text>
        ) : relevantBookings.length > 0 ? (
          <FlatList
            data={relevantBookings}
            renderItem={renderBooking}
            keyExtractor={item => item.id}
            style={styles.bookingsSection}
          />
        ) : (
          <View style={styles.emptyBookingContainer}>
            <Text style={styles.emptyBookingText}>No upcoming bookings.</Text>
          </View>
        )}
        {/* Discovery Section */}
        <View style={styles.bookingsHeader}>
          <Text style={styles.sectionTitle}>New Pubs</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PubsFinderScreen', {
                searchQuery: '',
                filter: 'pubs',
              })
            }>
            <Text style={styles.moreButton}>More</Text>
          </TouchableOpacity>
        </View>
        {loadingRecentPubs ? (
          <Text>Loading discover...</Text>
        ) : (
          <FlatList
            horizontal
            data={recentPubs}
            renderItem={renderDiscover}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            style={styles.featuredPubs}
          />
        )}
        {/* Promotions and Events */}
        <View style={styles.bookingsHeader}>
          <Text style={styles.sectionTitle}>Promotions and Events</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PubsFinderScreen', {
                searchQuery: '',
                filter: 'events',
              })
            }>
            <Text style={styles.moreButton}>More</Text>
          </TouchableOpacity>
        </View>
        {loadingAllEvents ? (
          <Text>Loading events...</Text>
        ) : (
          <FlatList
            horizontal
            data={allEvents}
            renderItem={renderPromotion}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.featuredPubs}
          />
        )}
        {/* User Activity Feed */}
        <Text style={styles.sectionTitle}></Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyBookingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyBookingText: {
    fontSize: 16,
    color: '#666',
  },
  featuredPubs: {
    paddingLeft: 16,
    paddingTop: 16,
  },
  pubItem: {
    width: 350,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  pubImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pubName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  beerItem: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  beerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  beerName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  bookingsSection: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  bookingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
    paddingTop: 10,
  },
  moreButton: {
    fontSize: 16,
    color: '#007bff',
  },
  bookingItem: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 3,
  },
  bookingThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  bookingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E3B36',
  },
  bookingDetails: {
    fontSize: 14,
    color: '#3E3B36',
    opacity: 0.8,
  },
  bookingStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  promotionItem: {
    width: 350,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  promotionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  promotionName: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  promotionDescription: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: 'white',
    fontSize: 14,
  },
  eventItem: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width / 1,
    overflow: 'hidden',
    backgroundColor: 'yellow',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventName: {
    position: 'absolute',
    bottom: 90,
    left: 10,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  eventDescription: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    color: 'white',
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 90,
    paddingHorizontal: 10,
    paddingTop: 30,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  searchInput: {
    width: '80%',
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f1e7',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E3B36',
    paddingLeft: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
});

export default HomeScreen;
