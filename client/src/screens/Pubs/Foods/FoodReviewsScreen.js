import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import useFoodReviews from '../../../hooks/useFoodReviews';

const FoodReviewsScreen = ({item}) => {
  const {reviews, loading} = useFoodReviews(item.id);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!reviews.length) {
    return <Text>No reviews found for this item.</Text>;
  }

  return (
    <FlatList
      data={reviews}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.reviewContainer}>
          <Text style={styles.reviewText}>{item.comment}</Text>
          {/* Add more review details as needed */}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  reviewContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  reviewText: {
    fontSize: 16,
    color: '#333',
  },
  // Add more styles as needed
});

export default FoodReviewsScreen;
