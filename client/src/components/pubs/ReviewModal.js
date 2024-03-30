import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Rating} from 'react-native-ratings';
import {addReview, updateReview} from '@services/Reviews/reviewService';

const ReviewModal = ({
  isVisible,
  onClose,
  review,
  pubId,
  userId,
  type,
  itemId,
}) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  // Pre-fill form when editing
  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setTitle(review.title);
      setComment(review.comment);
    }
  }, [review]);

  const reviewData = {
    rating,
    title,
    comment,
    type,
    pubId,
    userId,
    itemId: type === 'pubs' ? null : itemId,
  };

  const resetForm = () => {
    setRating(0);
    setTitle('');
    setComment('');
  };

  const handleSubmission = async () => {
    if (!title.trim() || !comment.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    console.log('Submitting Review Data:', reviewData);
    try {
      if (review) {
        const reviewId = review.id;
        await updateReview(type, reviewId, reviewData);
      } else {
        await addReview(type, reviewData);
      }
      Alert.alert(
        review ? 'Review updated successfully' : 'Review added successfully',
      );
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
      Alert.alert(
        'Submission Error',
        'Failed to submit your review. Please try again.',
      );
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        resetForm();
        onClose();
      }}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            Write a Review - {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              resetForm();
              onClose();
            }}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Comment"
            value={comment}
            onChangeText={setComment}
            style={styles.input}
            multiline={true}
            numberOfLines={4}
          />
          <Rating
            startingValue={rating}
            imageSize={20}
            onFinishRating={setRating}
          />
          <Button
            title={review ? 'Update' : 'Submit'}
            onPress={handleSubmission}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  closeButtonText: {
    color: '#355E3B',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
});

export default ReviewModal;
