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
  Modal,
  Button,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import authService from '../../services/authService';
import useUserProfileData from '../../hooks/useUserProfileData';
import AuthContext from '../../contexts/AuthContext';
import {Rating} from 'react-native-ratings';

const ProfileScreen = ({route}) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const {currentUserId} = useContext(AuthContext);

  // Determine if we're viewing the current user's profile or another user's profile
  const userId = route.params?.userId || currentUserId;

  // Fetch the profile data based on the determined userId
  const {
    profile,
    places,
    friends,
    reviews,
    loading: profileLoading,
  } = useUserProfileData(userId);

  const isOtherUserProfile = route.params?.isOtherUserProfile || false;
  const [activeTab, setActiveTab] = useState('pubs');
  const filteredReviews = reviews.filter(review => review.type === activeTab);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalSearchText, setModalSearchText] = useState('');
  const [modalData, setModalData] = useState([]);
  const [modalDataType, setModalDataType] = useState('');

  useEffect(() => {
    setLoading(profileLoading);
  }, [profileLoading]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setModalVisible(false);
    });
  
    return unsubscribe;
  }, [navigation]);

  const handleLogout = () => {
    authService.signOut();
  };

  const handleSearch = async query => {
    // To avoid searching for the current user
    if (!query.trim() || query === profile?.username) {
      console.log("Can't search for yourself.");
      return;
    }

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
  const Section = ({title, data, renderItem, dataType}) => (
    <View style={styles.commonSection}>
      <Text style={styles.sectionHeading}>{title}</Text>
      {data && (
        <FlatList
          data={data.slice(0, 3)}
          keyExtractor={item => item.id}
          renderItem={({item}) => renderItem({item})}
          horizontal
          style={styles.horizontalScroll}
        />
      )}
      {data && data.length > 3 && (
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            setModalVisible(true);
            setModalData(data);
            setModalDataType(dataType);
          }}>
          <Text style={styles.moreButtonText}>More</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Render item for the places section
  const renderPlacesItem = ({item, inModal}) => (
    <TouchableOpacity
      style={inModal ? styles.modalPlaceItem : styles.placeItem}
      onPress={() => navigation.navigate('PubDetails', {pubId: item.pubId})}>
      <Image style={styles.placeItemImage} source={{uri: item.photoURL}} />
      <Text style={inModal ? styles.modalPlaceItemText : styles.placeItemText}>
        {item.displayName}
      </Text>
    </TouchableOpacity>
  );

  // Render item for the reviews section
  const renderReviewsItem = ({item, inModal}) => {
    // Truncate the comment to limit the characters
    const truncatedComment =
      item.comment.length > 70
        ? item.comment.substring(0, 67) + '...'
        : item.comment;

    return (
      <TouchableOpacity
        style={inModal ? styles.modalReviewItem : styles.reviewItem}
        onPress={() =>
          navigation.navigate('PubReviews', {
            pubId: item.pubId,
            reviewId: item.reviewId,
          })
        }>
        <Image style={styles.reviewItemImage} source={{uri: item.image}} />
        <Text style={styles.reviewContent}>{item.pubName}</Text>
        <Text style={styles.reviewTitle}>{item.displayName}</Text>
        <Text style={styles.reviewContent}>{truncatedComment}</Text>
        <Rating
          style={styles.reviewRating}
          type="custom"
          ratingCount={5}
          readonly
          startingValue={item.rating}
          imageSize={15}
          tintColor="#EFEFEF"
          //ratingColor="yellow"
          //type="heart"
          //showRating
          //ratingImage={WATER_IMAGE}
          //ratingBackgroundColor="#c8c7c8"
        />
      </TouchableOpacity>
    );
  };

  // Render item for the friends section
  const renderFriendsItem = ({item, inModal}) => (
    <TouchableOpacity
      style={inModal ? styles.modalFriendItem : styles.friendItem}
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
                navigation.replace('ProfileScreen', {userId: currentUserId})
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
          <Image style={styles.avatar} source={{uri: profile?.userAvatar}} />
          <Text style={styles.name}>{profile?.displayName}</Text>
          <Text style={styles.bio}>@{profile?.username}</Text>
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
        <Section
          title="Places Visited"
          data={places}
          renderItem={renderPlacesItem}
          dataType="places"
        />
        {/* Subsections for Reviews */}
        <View style={styles.tabsContainer}>
          {['pubs', 'food', 'drinks'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}>
              <Text style={styles.tabText}>{tab.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Render the content based on the active tab */}
        <Section
          title={`${
            activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
          } Reviews`}
          data={filteredReviews}
          renderItem={renderReviewsItem}
          dataType="reviews"
        />
        <Section
          title="Friends"
          data={friends}
          renderItem={renderFriendsItem}
          dataType="friends"
        />
        <Section />
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}>
        <View style={styles.modalContent}>
          <View>
            <TextInput
              style={styles.searchBar}
              placeholder="Search..."
              value={modalSearchText}
              onChangeText={text => setModalSearchText(text)}
            />
            <FlatList
              showsVerticalScrollIndicator={false}
              data={modalData.filter(item =>
                item.displayName
                  .toLowerCase()
                  .includes(modalSearchText.toLowerCase()),
              )}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                switch (modalDataType) {
                  case 'places':
                    return renderPlacesItem({item, inModal: true});
                  case 'friends':
                    return renderFriendsItem({item, inModal: true});
                  case 'reviews':
                    return renderReviewsItem({item, inModal: true});
                  default:
                    return <Text>Unknown item type</Text>;
                }
              }}
            />
          </View>
        </View>
        <Button
          style={styles.closeButton}
          title="Close"
          onPress={() => {
            setModalVisible(!isModalVisible);
          }}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalPlaceItem: {
    marginRight: 10,
    width: 120,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPlaceItemText: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    bottom: 5,
  },
  modalReviewItem: {
    marginRight: 10,
    padding: 10,
    width: 300,
    height: 170,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFriendItem: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CCC',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  moreButton: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
  moreButtonText: {
    color: '#355E3B',
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    //marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#355E3B',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#355E3B',
  },
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
    //paddingLeft: 20,
    //paddingRight: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  placeItem: {
    marginRight: 15,
    width: 150,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#EFEFEF',
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
  // Review List Item
  reviewItem: {
    marginRight: 15,
    //padding: 10,
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#EFEFEF',
    //justifyContent: 'center',
    //alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 3,
  },
  reviewItemImage: {
    width: '100%',
    height: 65,
    overflow: 'hidden',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  reviewContent: {
    fontSize: 14,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  reviewRating: {
    marginTop: 5,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  friendItem: {
    width: 60,
    height: 60,
    borderRadius: 35,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFEFEF',
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
});

export default ProfileScreen;
