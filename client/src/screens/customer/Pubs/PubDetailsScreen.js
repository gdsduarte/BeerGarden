/**
 * PubDetailsScreen is the screen for displaying the details of a pub.
 */

import React from 'react';
import {Text, Image, ScrollView, StyleSheet, Alert, View} from 'react-native';
import {usePubDetails} from '@hooks';
import Loading from '@components/common/Loading';

const PubDetailsScreen = ({pubId}) => {
  const {pub, loading, error} = usePubDetails(pubId);

  if (loading) return <Loading />;

  // Error handling
  if (error || !pubId) {
    Alert.alert(
      'Error',
      'Invalid pubId provided or failed to fetch pub details.',
    );
    return null;
  }

  // Function to render opening and food service hours
  const renderHours = hours => {
    return Object.entries(hours).map(([day, hours], index) => (
      <Text key={index} style={styles.bio}>{`${
        day.charAt(0).toUpperCase() + day.slice(1)
      }: ${hours}`}</Text>
    ));
  };

  // Function to render special hours
  const renderSpecialHours = specialHours => {
    return specialHours.map((special, index) => (
      <View key={index} style={styles.specialHoursView}>
        <Text style={styles.bio}>
          {special.date} - {special.note}
        </Text>
        <Text style={styles.bio}>{special.openingHours}</Text>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{uri: pub.photoUrl}} style={styles.image} />
      <Text style={styles.name}>{pub.displayName}</Text>
      <Text style={styles.bio}>{pub.description}</Text>
      <Text style={styles.bio}>{`Address: ${pub.address}`}</Text>
      <Text style={styles.bio}>{`Email: ${pub.email}`}</Text>
      <Text style={styles.bio}>{`Phone: ${pub.phone}`}</Text>
      <Text style={styles.bio}>{`Seats Capacity: ${pub.seatsCapacity}`}</Text>
      {pub.openingHours && (
        <Text style={styles.sectionTitle}>Opening Hours</Text>
      )}
      {pub.openingHours && renderHours(pub.openingHours)}
      {pub.foodServiceHours && (
        <Text style={styles.sectionTitle}>Food Service Hours</Text>
      )}
      {pub.foodServiceHours && renderHours(pub.foodServiceHours)}
      {pub.specialHours && (
        <Text style={styles.sectionTitle}>Special Hours</Text>
      )}
      {pub.specialHours && renderSpecialHours(pub.specialHours)}
    </ScrollView>
  );
};

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
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  specialHoursView: {
    marginBottom: 10,
  },
});

export default PubDetailsScreen;
