/**
 * This screen displays the details of a specific event.
 */

import React from 'react';
import {ScrollView, Text, Image, StyleSheet, View} from 'react-native';
import Loading from '@components/common/Loading';
import {usePubEventDetails} from '@hooks';

const PubEventDetailScreen = ({route}) => {
  const {eventId} = route.params;
  const [eventDetails, loading] = usePubEventDetails(eventId);
  
  if (loading) return <Loading />;

  // Render the schedule for the event
  const renderSchedule = (schedule) => {
    return schedule.map((item, index) => (
      <View key={index} style={styles.scheduleItem}>
        <Text style={styles.scheduleText}>Day: {item.day}</Text>
        <Text style={styles.scheduleText}>Start: {item.startTime}</Text>
        <Text style={styles.scheduleText}>End: {item.endTime}</Text>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{uri: eventDetails.eventImage}} style={styles.image} />
      <Text style={styles.name}>{eventDetails.eventName || eventDetails.displayName}</Text>
      <Text style={styles.bio}>{eventDetails.description}</Text>
      {eventDetails.schedule && (
        <View style={styles.scheduleContainer}>
          {renderSchedule(eventDetails.schedule)}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  scheduleContainer: {
    paddingHorizontal: 10,
  },
  scheduleItem: {
    marginTop: 5,
  },
  scheduleText: {
    fontSize: 14,
  },
});

export default PubEventDetailScreen;
