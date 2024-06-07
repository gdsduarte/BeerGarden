/**
 * A screen to display all the events of a pub
 */

import React from 'react';
import {Text, Image, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {usePubEvents} from '@hooks';
import Loading from '@components/common/Loading';
import {useNavigation} from '@react-navigation/native';

const PubEventsScreen = ({pubId}) => {
  const {pubEvents, loading} = usePubEvents(pubId);
  const navigation = useNavigation();

  if (loading) return <Loading />;

  // Display message if no events are found
  if (!pubEvents || pubEvents.length === 0) {
    return <Text style={styles.name}>No events found</Text>;
  }

  // Handle navigation to the event details screen
  const handlePress = eventId => {
    navigation.navigate('PubEventsDetails', {eventId});
  };
 
  return (
    <FlatList
      data={pubEvents}
      style={styles.container}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <TouchableOpacity onPress={() => handlePress(item.id)}>
          <Image source={{uri: item.eventImage}} style={styles.image} />
          <Text style={styles.name}>{item.eventName || item.displayName}</Text>
          <Text style={styles.bio}>{item.description}</Text>
        </TouchableOpacity>
      )}
    />
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
    resizeMode: 'cover',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  bio: {
    fontSize: 16,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});

export default PubEventsScreen;
