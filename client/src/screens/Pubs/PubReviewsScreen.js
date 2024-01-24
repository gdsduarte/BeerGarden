import React, {useMemo} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import useReviews from '../../hooks/useReviews';
import {Rating} from 'react-native-ratings';
import Loading from '../../components/common/Loading';

const PubReviewsScreen = ({pubId}) => {
  const {reviews, loading} = useReviews(pubId);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    );
  }, [reviews]);

  if (loading) return <Loading />;

  return (
    <View style={styles.container}>
      <Text style={styles.averageRatingText}>Average Rating</Text>
      <Rating readonly startingValue={averageRating} imageSize={20} />
      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewText}>{item.comment}</Text>
            <Rating readonly startingValue={item.rating} imageSize={15} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  averageRatingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reviewCard: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  reviewText: {
    marginBottom: 5,
    color: 'black',
  },
  // Add more styles as needed
});

export default PubReviewsScreen;
