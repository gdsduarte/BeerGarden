import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TextInput,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import authService from '../../services/authService';
import useUserProfileData from '../../hooks/useUserProfileData';
import AuthContext from '../../contexts/AuthContext';

const ProfileScreen = ({route}) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const {currentUserUID} = useContext(AuthContext);

  // Determine if we're viewing the current user's profile or another user's profile
  const userId = route.params?.userId || currentUserUID;

  // Fetch the profile data based on the determined userId
  const {
    profile,
    places,
    friends,
    reviews,
    loading: profileLoading,
  } = useUserProfileData(userId);

  const isOtherUserProfile = route.params?.isOtherUserProfile || false;

  useEffect(() => {
    setLoading(profileLoading);
  }, [profileLoading]);

  const handleLogout = () => {
    authService.signOut();
  };

  const handleSearch = async query => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const querySnapshot = await firestore()
        .collection('user')
        .where('username', '==', query)
        .get();

      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to another user's profile
  const navigateToUserProfile = userId => {
    navigation.navigate('ProfileScreen', {
      isOtherUserProfile: true,
      userId: userId,
    });
  };

  // Section component to display profile data
  const Section = ({title, data, renderItem}) => (
    <View style={styles.commonSection}>
      <Text style={styles.sectionHeading}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => renderItem({item, renderItem})}
        horizontal
        style={styles.horizontalScroll}
      />
    </View>
  );

  // Render item for the places section
  const renderPlacesItem = ({item}) => (
    <TouchableOpacity style={styles.placeItem} onPress={() => {}}>
      <Image style={styles.placeItemImage} source={{uri: item.photoURL}} />
      <Text style={styles.placeItemText}>{item.displayName}</Text>
    </TouchableOpacity>
  );

  // Render item for the reviews section
  const renderReviewsItem = ({item}) => (
    <TouchableOpacity style={styles.reviewItem} onPress={() => {}}>
      <Text style={styles.reviewTitle}>{item.displayName}</Text>
      <Text style={styles.reviewContent}>{item.comment}</Text>
      <Text style={styles.reviewRating}>{item.rating}</Text>
    </TouchableOpacity>
  );

  // Render item for the friends section
  const rendeFriendsItem = ({item}) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => navigateToUserProfile(item.id)}>
      <Image style={styles.friendAvatar} source={{uri: item.photoURL}} />
      <Text style={styles.friendName}>{item.displayName}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => {}} />
        }>
        {/* Header Section */}
        <View style={styles.header}>
          {isOtherUserProfile && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                navigation.replace('ProfileScreen', {userId: currentUserUID})
              }>
              <Text style={styles.backButtonText}>{'<'}</Text>
            </TouchableOpacity>
          )}
          {!isOtherUserProfile && (
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={handleLogout}>
              <Text style={styles.settingsButtonText}>{'⚙️'}</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image style={styles.avatar} source={{uri: profile?.photoURL}} />
          <Text style={styles.name}>{profile?.displayName}</Text>
          <Text style={styles.bio}>{profile?.bio}</Text>
        </View>
        {isOtherUserProfile && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                /* Add friend logic */
              }}>
              <Text style={styles.addButtonText}>Add Friend</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.messageButton}
              onPress={() => {
                /* Start chat logic */
              }}>
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Search Bar */}
        {!isOtherUserProfile && (
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search users..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={() => handleSearch(searchText)}
            />
          </View>
        )}
        {/* Search Results */}
        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => navigateToUserProfile(item.id)}>
                <Text style={styles.userName}>{item.username}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{places.length}</Text>
            <Text style={styles.statLabel}>PLACES</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{reviews.length}</Text>
            <Text style={styles.statLabel}>REVIEWS</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{friends.length}</Text>
            <Text style={styles.statLabel}>FRIENDS</Text>
          </View>
        </View>
        {/* Display sections for places, friends, and reviews */}
        <Section
          title="Places Visited"
          data={places}
          renderItem={renderPlacesItem}
        />
        <Section
          title="Reviews"
          data={reviews}
          renderItem={renderReviewsItem}
        />
        <Section title="Friends" data={friends} renderItem={rendeFriendsItem} />
        <Section />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  searchBarContainer: {
    padding: 10,
    alignItems: 'center',
  },
  searchBar: {
    width: '70%',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 16,
  },
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
  addButton: {
    backgroundColor: '#8B4513',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  unAddButton: {
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
  addButtonText: {
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
  placeItemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: '#fff',
    borderWidth: 3,
  },
  placeItemText: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    bottom: 10,
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
    borderColor: '#fff',
    borderWidth: 3,
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
});

export default ProfileScreen;
