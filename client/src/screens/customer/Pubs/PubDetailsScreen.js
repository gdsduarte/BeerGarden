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
      <View style={styles.card}>
        <Text style={styles.bio}>{`Address: ${pub.address}`}</Text>
        <Text style={styles.bio}>{`Email: ${pub.email}`}</Text>
        <Text style={styles.bio}>{`Phone: ${pub.phone}`}</Text>
        {/* <Text style={styles.bio}>{`Seats Capacity: ${pub.seatsCapacity}`}</Text> */}
      </View>
      <View style={styles.card}>
        {pub.openingHours && (
          <Text style={styles.sectionTitle}>Opening Hours</Text>
        )}
        {pub.openingHours && renderHours(pub.openingHours)}
      </View>
      <View style={styles.card}>
        {pub.foodServiceHours && (
          <Text style={styles.sectionTitle}>Food Service Hours</Text>
        )}
        {pub.foodServiceHours && renderHours(pub.foodServiceHours)}
      </View>
      <View style={styles.card}>
        {pub.specialHours && (
          <Text style={styles.sectionTitle}>Special Hours</Text>
        )}
        {pub.specialHours && renderSpecialHours(pub.specialHours)}
      </View>
      <View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f1e7',
    padding: 15,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#355E3B',
  },
  cardContent: {
    fontSize: 16,
    color: '#666666',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#355E3B',
    borderBottomWidth: 2,
    borderBottomColor: '#d1d1d1',
    marginBottom: 12,
  },
  bio: {
    fontSize: 18,
    lineHeight: 24,
    color: '#333',
  },
  specialHoursView: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#355E3B',
    marginBottom: 10,
  },
});

export default PubDetailsScreen;
