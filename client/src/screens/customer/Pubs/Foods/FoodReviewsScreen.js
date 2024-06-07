/**
 * This screen displays the reviews for a food in a pub.
 * It allows users to view and write reviews for the food.
 * It also calculates the average rating for the food based on all reviews.
 * Users can edit or delete their own reviews.
 */

import React, {useState, useMemo, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useFoodReviews} from '@hooks';
import {Rating} from 'react-native-ratings';
import Loading from '@components/common/Loading';
import ReviewModal from '@components/pubs/ReviewModal';
import {format} from 'date-fns';
import AuthContext from '@contexts/AuthContext';
import {deleteReview} from '@services/Reviews/reviewService';

const PubReviewsScreen = ({item}) => {
  const {currentUserId} = useContext(AuthContext);
  const {reviews, loading} = useFoodReviews(item.id);
  const [modalVisible, setModalVisible] = useState(false);
  const [editableReview, setEditableReview] = useState(null);

  // Determine the default type from the first review (if reviews are loaded)
  const type = reviews.length > 0 ? reviews[0].type : undefined;

  // Handle the edit action for a review
  const handleEdit = review => {
    setEditableReview(review);
    setModalVisible(true);
  };

  // Calculate the average rating from the reviews
  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    );
  }, [reviews]);

  // Handle the delete action for a review
  const handleDelete = reviewId => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        {text: 'Cancel'},
        {
          text: 'Delete',
          onPress: () => {
            deleteReview(type, reviewId)
              .then(() => {
                Alert.alert('Success', 'Review deleted successfully.');
              })
              .catch(error => {
                console.error('Failed to delete review:', error);
                Alert.alert(
                  'Error',
                  'Failed to delete the review. Please try again later.',
                );
              });
          },
        },
      ],
    );
  };

  if (loading) return <Loading />;

  return (
    <View style={styles.container}>
      <Text style={styles.averageRatingText}>Average Rating</Text>
      <Rating
        readonly
        startingValue={averageRating}
        imageSize={20}
        tintColor="#f8f1e7"
      />
      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          let formattedReviewDate = 'Date not available';
          if (item.createdAt) {
            try {
              const reviewDate = item.createdAt.toDate();
              formattedReviewDate = format(reviewDate, 'dd/MM/yyyy');
            } catch (error) {
              console.error('Error formatting date:', error);
            }
          }
          return (
            <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>{item.title}</Text>
              <Text style={styles.reviewText}>{item.comment}</Text>
              <Text style={styles.reviewText}>{item.userName}</Text>
              <Text style={styles.reviewText}>{formattedReviewDate}</Text>
              <Rating readonly startingValue={item.rating} imageSize={15} />
              {item.userId === currentUserId && (
                <View style={styles.actionsContainer}>
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />
      <Button
        title="Write a Review"
        onPress={() => {
          setEditableReview(null);
          setModalVisible(true);
        }}
        color="#355E3B"
      />
      <ReviewModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        review={editableReview}
        pubId={item.pubId}
        userId={currentUserId}
        type={type}
        itemId={item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f1e7',
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
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  reviewText: {
    marginBottom: 5,
    color: 'black',
  },
});

export default PubReviewsScreen;
