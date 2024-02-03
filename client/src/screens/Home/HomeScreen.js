import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Carousel
} from 'react-native';

const featuredPubs = [
  {id: 'p1', name: 'Pub 1', image: 'https://picsum.photos/220'},
  {id: 'p2', name: 'Pub 2', image: 'https://picsum.photos/420'},
  {id: 'p3', name: 'Pub 3', image: 'https://picsum.photos/620'},
  {id: 'p4', name: 'Pub 4', image: 'https://picsum.photos/820'},
  {id: 'p5', name: 'Pub 5', image: 'https://picsum.photos/1020'},
];
const featuredBeers = [
  {id: 'be1', name: 'Beer 1', image: 'https://picsum.photos/320'},
  {id: 'be2', name: 'Beer 2', image: 'https://picsum.photos/520'},
  {id: 'be3', name: 'Beer 3', image: 'https://picsum.photos/720'},
  {id: 'be4', name: 'Beer 4', image: 'https://picsum.photos/920'},
];
const upcomingBookings = [
  {
    id: 'b1',
    pubName: 'The Crafty Fox',
    date: '2023-06-18',
    time: '18:30',
    partySize: 4,
    status: 'Confirmed',
    thumbnail: 'https://via.placeholder.com/100x100?text=Pub+1',
  },
  {
    id: 'b2',
    pubName: 'The Hopping Hare',
    date: '2023-06-20',
    time: '19:00',
    partySize: 2,
    status: 'Pending',
    thumbnail: 'https://via.placeholder.com/100x100?text=Pub+2',
  },
];
const discovery = [
  {
    id: 'd1',
    name: 'Craft Beer Co.',
    description: 'A cozy place for craft beer lovers.',
    image: 'https://via.placeholder.com/150',
  },
];

const promotions = [
  {
    id: 'p1',
    title: 'Happy Hour',
    details: 'Get 2 for 1 beers this Friday!',
    image: 'https://via.placeholder.com/150',
  },
];

const activity = [
  {
    id: 'a1',
    user: 'John Doe',
    action: 'checked in',
    location: 'The Brew Spot',
    image: 'https://via.placeholder.com/150',
  },
];

const HomeScreen = () => {

  const renderCarouselPubs = ({item}) => (
    <View style={styles.carouselItemPubs}>
      <Image source={{uri: item.image}} style={styles.carouselImage} />
      <Text style={styles.carouselText}>{item.name}</Text>
    </View>
  );

  const renderCarouselBeers = ({item}) => (
    <View style={styles.carouselItemBeers}>
      <Image source={{uri: item.image}} style={styles.carouselImage} />
      <Text style={styles.carouselText}>{item.name}</Text>
    </View>
  );

  const renderBookingItem = ({item}) => (
    <View style={styles.bookingItem}>
      <Image source={{uri: item.thumbnail}} style={styles.bookingThumbnail} />
      <Text style={styles.bookingName}>{item.pubName}</Text>
      <Text style={styles.bookingDetails}>{item.date}</Text>
      <Text style={styles.bookingInfo}>{item.time}</Text>
      <Text style={styles.bookingInfo}>{item.partySize} people</Text>
      <Text style={styles.bookingStatus}>{item.status}</Text>
    </View>
  );

  const renderDiscoveryItem = ({item}) => (
    <View style={styles.card}>
      <Image source={{uri: item.image}} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </View>
  );

  const renderPromotionItem = ({item}) => (
    <View style={styles.card}>
      <Image source={{uri: item.image}} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.details}</Text>
    </View>
  );

  const renderActivityItem = ({item}) => (
    <View style={styles.activityItem}>
      <Image source={{uri: item.image}} style={styles.activityImage} />
      <Text
        style={
          styles.activityText
        }>{`${item.user} ${item.action} at ${item.location}`}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Welcome to Beer Garden!</Text>
      {/* Featured Pubs Section */}
      <Text style={styles.sectionTitle}>Featured Pubs</Text>
      <FlatList
        horizontal
        data={featuredPubs}
        renderItem={renderCarouselPubs}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      />
      {/* Featured Beers Section */}
      <Text style={styles.sectionTitle}>Featured Beers</Text>
      <FlatList
        horizontal
        data={featuredBeers}
        renderItem={renderCarouselBeers}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      />
      {/* Upcoming Bookings Section */}
      <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
      <FlatList
        data={upcomingBookings}
        renderItem={renderBookingItem}
        keyExtractor={item => item.id}
        style={styles.bookingsPreview}
      />
      {/* Discovery Section */}
      <Text style={styles.sectionTitle}>Discovery</Text>
      <FlatList
        horizontal
        data={discovery}
        renderItem={renderDiscoveryItem}
        keyExtractor={item => item.id}
        style={styles.discoveryPreview}
      />
      {/* Promotions and Events */}
      <Text style={styles.sectionTitle}>Promotions and Events</Text>
      <FlatList
        horizontal
        data={promotions}
        renderItem={renderPromotionItem}
        keyExtractor={item => item.id}
        style={styles.promotionPreview}
      />
      {/* User Activity Feed */}
      <Text style={styles.sectionTitle}>Activity</Text>
      <FlatList
        data={activity}
        renderItem={renderActivityItem}
        keyExtractor={item => item.id}
        style={styles.activityPreview}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    flex: 1,
    backgroundColor: '#f8f1e7',
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3E3B36',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E3B36',
    paddingLeft: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  carousel: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  carouselItemPubs: {
    width: 350,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  carouselItemBeers: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  carouselText: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  bookingsPreview: {
    paddingHorizontal: 16,
  },
  bookingItem: {
    height: 150,
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
  discoveryPreview: {
    height: 200,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  promotionPreview: {
    height: 200,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  activityPreview: {
    paddingHorizontal: 16,
  },
  card: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
    marginHorizontal: 10,
    color: '#3e3e3e',
  },
  cardDescription: {
    fontSize: 14,
    margin: 10,
    marginBottom: 15,
    color: '#5c5c5c',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  activityImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#5c5c5c',
  },
});

export default HomeScreen;
