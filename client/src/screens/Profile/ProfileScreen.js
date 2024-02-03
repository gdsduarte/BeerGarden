import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import authService from '../../services/authService';

const ProfileScreen = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUserId = 'user_id';
  const userIdToFollow = 'id_of_user_to_follow'; 
  const navigation = useNavigation();

  const handleLogout = () => {
    authService.signOut();
  };

  // Dummy data for places, friends, and followers
  const places = [
    {id: 1, name: 'Pub One', image: 'image_url_1'},
    {id: 2, name: 'Pub Two', image: 'image_url_2'},
  ];

  const friends = [
    {id: 1, name: 'Alice', image: 'image_url_1'},
    {id: 2, name: 'Bob', image: 'image_url_2'},
  ];

  const followers = [
    {id: 1, name: 'Charlie', image: 'image_url_3'},
    {id: 2, name: 'Dana', image: 'image_url_4'},
  ];

  const reviews = [
    {
      id: 1,
      title: 'Great Atmosphere',
      content: 'Loved the vibe at Pub One!',
      rating: 5,
    },
    {
      id: 2,
      title: 'Amazing Music',
      content: 'Pub Two had amazing live music!',
      rating: 4,
    },
  ];

  // Render item functions for each section
  const renderPlaceItem = place => (
    <View key={place.id} style={styles.placeItem}>
      <Text style={styles.placeItemText}>{place.name}</Text>
    </View>
  );

  const renderFriendItem = friend => (
    <View key={friend.id} style={styles.friendItem}>
      <Image source={{uri: friend.avatar}} style={styles.friendAvatar} />
      <Text style={styles.friendName}>{friend.name}</Text>
    </View>
  );

  const renderFollowerItem = follower => (
    <View key={follower.id} style={styles.followerItem}>
      <Image source={{uri: follower.avatar}} style={styles.followerAvatar} />
      <Text style={styles.followerName}>{follower.name}</Text>
    </View>
  );

  const renderReviewItem = review => (
    <View key={review.id} style={styles.reviewItem}>
      <Text style={styles.reviewTitle}>{review.title}</Text>
      <Text style={styles.reviewContent}>{review.content}</Text>
      <Text style={styles.reviewRating}>{'Rating: ' + review.rating}</Text>
    </View>
  );

  // Section Component
  const Section = ({title, data, renderItem}) => (
    <View style={styles[`${title.toLowerCase()}Section`]}>
      <Text style={styles.sectionHeading}>{title}</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}>
        {data.map(renderItem)}
      </ScrollView>
    </View>
  );

  const handleFollowToggle = async () => {
    const userRef = firestore().collection('users').doc(userIdToFollow);

    try {
      if (isFollowing) {
        // Unfollow logic
        await userRef.update({
          followers: firestore.FieldValue.arrayRemove(currentUserId),
        });
        setIsFollowing(false);
      } else {
        // Follow logic
        await userRef.update({
          followers: firestore.FieldValue.arrayUnion(currentUserId),
        });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error updating follow status: ', error);
    }
  };

  // Function to handle message button press
  const handleMessagePress = () => {
    // Navigate to ChatScreen with user information
    navigation.navigate('Chat', {userId: 'id_of_user'});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {}}
          />
        }>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton} onPress={handleLogout}>
            <Text style={styles.settingsButtonText}>{'⚙️'}</Text>
          </TouchableOpacity>
        </View>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            style={styles.avatar}
            source={{uri: 'path_to_your_avatar_image'}}
          />
          <Text style={styles.name}>Jody Wisternoff</Text>
          <Text style={styles.bio}>
            Experimental electronic music pioneer. Half of duo Way Out West.
            Boss at Anjunadeep.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={isFollowing ? styles.unfollowButton : styles.followButton}
              onPress={handleFollowToggle}>
              <Text style={styles.followButtonText}>
                {isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.messageButton}
              onPress={handleMessagePress}>
              <Text style={styles.messageButtonText}>MESSAGE</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>236</Text>
            <Text style={styles.statLabel}>PLACES</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>23.6k</Text>
            <Text style={styles.statLabel}>REVIEWS</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2.8k</Text>
            <Text style={styles.statLabel}>FOLLOWERS</Text>
          </View>
        </View>
        {/* Places, Friends, Reviews, Followers Sections */}
        <Section
          title="Places Visited"
          data={places}
          renderItem={renderPlaceItem}
        />
        <Section title="Friends" data={friends} renderItem={renderFriendItem} />
        <Section title="Reviews" data={reviews} renderItem={renderReviewItem} />
        <Section
          title="Followers"
          data={followers}
          renderItem={renderFollowerItem}
        />
      </ScrollView>
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
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    backgroundColor: '#355E3B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 180,
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settingsButton: {
    position: 'absolute',
    right: 20,
    top: 50,
  },
  settingsButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -80,
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#FFFFFF',
    borderWidth: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'YourSerifFont',
    paddingVertical: 5,
  },
  bio: {
    fontFamily: 'YourSansSerifFont',
    color: '#666',
    textAlign: 'center',
    paddingBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  followButton: {
    backgroundColor: '#8B4513',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  unfollowButton: {
    backgroundColor: '#B22222',
  },
  messageButton: {
    backgroundColor: '#f0e6d2',
    borderColor: '#8B4513',
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  messageButtonText: {
    color: '#8B4513',
    fontWeight: 'bold',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#f8f1e7',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#355E3B',
  },
  statLabel: {
    color: '#8B4513',
  },
  commonSection: {
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 20,
    paddingBottom: 10,
    color: '#000',
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  placeItem: {
    marginRight: 15,
    width: 150,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeItemText: {
    color: '#FFF',
  },
  friendItem: {
    width: 60,
    height: 60,
    borderRadius: 35,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CCC',
  },
  friendAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  friendName: {
    fontSize: 12,
    textAlign: 'center',
  },
  reviewItem: {
    width: 250,
    height: 150,
    borderRadius: 8,
    margin: 10,
    padding: 10,
    backgroundColor: '#CCC',
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewContent: {
    fontSize: 14,
    marginTop: 5,
  },
  reviewRating: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
  },
  followerItem: {
    width: 60,
    height: 60,
    borderRadius: 35,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CCC',
  },
  followerAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  followerName: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ProfileScreen;
