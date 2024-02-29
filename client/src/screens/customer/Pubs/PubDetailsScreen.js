import React from 'react';
import {Text, Image, ScrollView, StyleSheet, Alert} from 'react-native';
import {usePubDetails} from '../../../hooks';
import Loading from '../../../components/common/Loading';
import {useNavigation} from '@react-navigation/native';

const PubDetailsScreen = ({pubId}) => {
  const {pub, loading, error} = usePubDetails(pubId);
  const navigation = useNavigation();

  if (loading) return <Loading />;
  if (error || !pubId) {
    // Handle the lack of a valid pubId, e.g., show an error or navigate back
    console.error('Invalid pubId provided');
    navigation.goBack();
    return null; // Prevent further rendering
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{uri: pub.photoUrl}} style={styles.image} />
      <Text style={styles.name}>{pub.displayName}</Text>
      <Text style={styles.description}>{pub.description}</Text>
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
  description: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
});

export default PubDetailsScreen;
