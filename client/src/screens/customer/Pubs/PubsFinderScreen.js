/**
 * This file contains the PubsFinderScreen.
 * It is the screen where the customer can search for pubs, drinks, foods, events, and beers.
 * The customer can also filter the search results by category.
 * The screen displays the search results in a scrollable list of cards.
 * The card flips to display more information about the item when clicked.
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import {useFinder} from '@hooks';
import Loading from '@components/common/Loading';
import FlipCard from 'react-native-flip-card';

const PubsFinderScreen = ({route}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState(route.params.filter || 'all');
  const {items: pubs, loading: loadingPubs} = useFinder(
    'pub',
    searchQuery,
    filter,
  );
  const {items: drinks, loading: loadingDrinks} = useFinder(
    'drinks',
    searchQuery,
    filter,
  );
  const {items: foods, loading: loadingFoods} = useFinder(
    'foods',
    searchQuery,
    filter,
  );
  const {items: events, loading: loadingEvents} = useFinder(
    'event',
    searchQuery,
    filter,
  );
  const {items: beers, loading: loadingBeers} = useFinder(
    'beers',
    searchQuery,
    filter,
  );

  // Determine overall loading state
  const loading =
    loadingPubs ||
    loadingDrinks ||
    loadingFoods ||
    loadingEvents ||
    loadingBeers;

  // Update the filter when the route params change
  useEffect(() => {
    if (route.params?.filter) {
      setFilter(route.params.filter);
    }
  }, [route.params?.filter]);

  // Combine all items into a single array
  const allItems = [...pubs, ...drinks, ...foods, ...events, ...beers];

  /* const filteredItems = allItems.filter(item => {
    switch (filter) {
      case 'pubs':
        return item.category === 'pub';
      case 'beers':
        return item.category === 'beer';
      case 'foods':
        return item.type === 'food';
      case 'events':
        return item.category === 'event';
      case 'drinks':
        return item.type === 'drink';
      default:
        return true;
    }
  }); */

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.filterButtonsContainer}>
          {['pubs', 'events', 'beers', 'foods', 'drinks'].map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterButton,
                filter === f && styles.filterButtonActive,
              ]}
              onPress={() => setFilter(f)}>
              <Text style={styles.filterButtonText}>{f.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView style={styles.itemsList}>
          {allItems.length > 0 ? (
            allItems.map(item => (
              <FlipCard
                key={item.id}
                flipHorizontal={false}
                flipVertical={true}
                style={styles.flipCard}>
                {/* Face Side */}
                <View style={styles.item}>
                  <Image
                    style={styles.itemImage}
                    source={{
                      uri: item.image || item.photoUrl || item.eventImage,
                    }}
                  />
                  <View style={styles.itemDetailContainer}>
                    <Text style={styles.itemName}>
                      {item.name || item.displayName}
                    </Text>
                    {item.pub && (
                      <View>
                        <Text style={styles.itemDetail}>
                          {item.pub.displayName}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                {/* Back Side */}
                <View style={styles.itemBack}>
                  <Text style={styles.itemDetail}>{item.description}</Text>
                  <Text style={styles.itemDetail}>Rating: {item.rating}</Text>
                  {item.pub && (
                    <View>
                      <Text style={styles.itemDetail}>{item.pub.address}</Text>
                    </View>
                  )}
                  <TouchableOpacity style={styles.itemTouch}>
                    <Text style={styles.moreText}>More info about</Text>
                  </TouchableOpacity>
                </View>
              </FlipCard>
            ))
          ) : (
            <View style={styles.loadingContainer}>
              <Loading />
              <Text>Loading items...</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f1e7',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f8f1e7',
  },
  searchBar: {
    fontSize: 18,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#355E3B',
    borderRadius: 5,
  },
  filterButtonActive: {
    backgroundColor: '#355E3B',
    borderColor: '#fff',
  },
  filterButtonText: {
    color: '#000000',
  },
  itemsList: {
    paddingHorizontal: 10,
  },
  flipCard: {
    marginBottom: 20,
    borderWidth: 0,
  },
  item: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 20,
    height: 200,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  itemBack: {
    padding: 10,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  itemDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  itemDetail: {
    fontSize: 16,
    textAlign: 'center',
  },
  itemTouch: {
    marginTop: 15,
    backgroundColor: '#355E3B',
    borderRadius: 5,
    alignSelf: 'center',
  },
  moreText: {
    color: '#ffffff',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default PubsFinderScreen;
