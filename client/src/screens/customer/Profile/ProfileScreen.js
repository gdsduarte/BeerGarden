/**
 * ProfileScreen is the screen for the user profile.
 * It displays the user's profile information, places visited, reviews, and friends.
 * The user can also edit their profile, logout, and search for other users.
 * The user can also navigate to the details of the places they visited and the reviews they made.
 * The user can also navigate to the profile of their friends.
 */

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
  FlatList,
  Modal,
  TextInput,
  Button,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useUserProfileData} from '@hooks';
import AuthContext from '@contexts/AuthContext';
import {Rating} from 'react-native-ratings';
import ReviewsModal from '@components/profile/ReviewsModal';
import SearchUserModal from '@components/profile/SearchUserModal';
import Icon from 'react-native-vector-icons/FontAwesome';
import {launchImageLibrary} from 'react-native-image-picker';
import {fetchUserDetailsById} from '../../../hooks/customer/useReservationActions';
import {updateProfile} from '@services/databaseService';
import {useFocusEffect} from '@react-navigation/native';

const ProfileScreen = ({route}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {currentUserId} = useContext(AuthContext);
  const {signOut} = useContext(AuthContext);
  const userId = currentUserId;
  const {
    profile,
    places,
    friends,
    reviews,
    loading: profileLoading,
    refreshData,
  } = useUserProfileData(userId);
  const [activeTab, setActiveTab] = useState('pubs');
  const filteredReviews = reviews.filter(review => review.type === activeTab);
  const [modalData, setModalData] = useState([]);
  const [modalDataType, setModalDataType] = useState('');
  const [isReviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [isSearchUserModalVisible, setSearchUserModalVisible] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState(null);
  const [friendsDetails, setFriendsDetails] = useState({});

  // Handle choosing a photo from the device
  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setPhoto(response.assets[0].uri);
      }
    });
  };

  // Fetch the details of the user's friends
  useEffect(() => {
    async function fetchAndSetFriendsDetails() {
      try {
        const detailsPromises = friends
          .map(friend => friend.id)
          .map(id => fetchUserDetailsById(id));
        const details = await Promise.all(detailsPromises);

        const detailsMap = details.reduce((acc, detail, index) => {
          acc[friends[index].id] = detail;
          return acc;
        }, {});

        setFriendsDetails(detailsMap);
      } catch (error) {
        console.error('Failed to fetch friends details:', error);
      }
    }

    fetchAndSetFriendsDetails();
  }, [friends]);

  // Change the status bar color
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      return () => {
        StatusBar.setBarStyle('dark-content');
      };
    }, []),
  );

  // Set the profile data when it is loaded
  useEffect(() => {
    setLoading(profileLoading);
  }, [profileLoading]);

  // Navigate to another user's profile
  const navigateToUserProfile = userId => {
    navigation.navigate('UsersProfileScreen', {
      userId: userId,
    });
  };

  // Section component to display profile data
  const Section = ({title, data, renderItem, dataType}) => (
    <View style={styles.commonSection}>
      <Text style={styles.sectionHeading}>{title}</Text>
      {data && (
        <FlatList
          data={data.slice(0, 5)}
          keyExtractor={item => item.id}
          renderItem={({item}) => renderItem({item})}
          horizontal
          style={styles.horizontalScroll}
        />
      )}
      {data && data.length > 4 && (
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            setReviewsModalVisible(true);
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
      <Image style={styles.placeItemImage} source={{uri: item.photoUrl}} />
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
        />
      </TouchableOpacity>
    );
  };

  // Render item for the friends section
  const renderFriendsItem = ({item, inModal}) => {
    const friendDetails = friendsDetails[item.id];

    return (
      <TouchableOpacity
        style={inModal ? styles.modalFriendItem : styles.friendItem}
        onPress={() => navigateToUserProfile(item.id)}>
        <Image
          style={styles.friendAvatar}
          source={{uri: friendDetails?.photoUrl}}
        />
        <Text style={styles.friendName}>{friendDetails?.displayName}</Text>
      </TouchableOpacity>
    );
  };

  // Render the dropdown menu for the settings button
  const renderDropdownMenu = () => (
    <Modal
      animationType="none"
      transparent={true}
      visible={isDropdownVisible}
      onRequestClose={() => setDropdownVisible(false)}>
      <TouchableOpacity
        style={styles.dropdownOverlay}
        activeOpacity={1}
        onPressOut={() => setDropdownVisible(false)}>
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={handleEditProfile}>
            <Text style={styles.dropdownItem}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.dropdownItem}>Logout</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Handle the edit profile button
  const handleEditProfile = () => {
    setIsEditMode(true);
    setDropdownVisible(false);
  };

  // Save the profile data
  const saveProfile = () => {
    const profileData = {
      displayName: name,
      bio,
      photoUrl: photo,
    };
    updateProfile(currentUserId, profileData);
    refreshData();
    setIsEditMode(false);
  };

  // Handle the cancel edit button
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setBio(profile?.bio);
    setName(profile?.displayName);
    setPhoto(profile?.photoUrl);
  };

  // Handle the logout button
  const handleLogout = () => {
    signOut();
  };

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
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setDropdownVisible(!isDropdownVisible)}>
            <Icon style={styles.settingsButtonText} name="cog" size={28} />
          </TouchableOpacity>
        </View>
        {/* Profile Section */}
        {isEditMode ? (
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={handleChoosePhoto}>
              <Image
                style={styles.avatar}
                source={{uri: photo || profile?.photoUrl}}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Name"
            />
            <TextInput
              style={styles.textInput}
              value={bio}
              onChangeText={setBio}
              placeholder="Bio"
              multiline
            />
            <View style={styles.editButton}>
              <Button title="Save" onPress={saveProfile} />
              <Button title="Cancel" onPress={handleCancelEdit} />
            </View>
          </View>
        ) : (
          <View style={styles.profileSection}>
            <Image style={styles.avatar} source={{uri: profile?.photoUrl}} />
            <Text style={styles.name}>{profile?.displayName}</Text>
            <Text style={styles.bio}>@{profile?.username}</Text>
            <Text style={styles.bio}>{profile?.bio}</Text>
          </View>
        )}
        {/* Trigger Search Modal */}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setSearchUserModalVisible(true)}>
          <Text style={styles.searchButtonText}>Search Users</Text>
        </TouchableOpacity>
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
      <ReviewsModal
        isModalVisible={isReviewsModalVisible}
        setModalVisible={setReviewsModalVisible}
        modalData={modalData}
        modalDataType={modalDataType}
        renderPlacesItem={renderPlacesItem}
        renderReviewsItem={renderReviewsItem}
        renderFriendsItem={renderFriendsItem}
      />
      <SearchUserModal
        isSearchModalVisible={isSearchUserModalVisible}
        setSearchModalVisible={setSearchUserModalVisible}
        navigateToUserProfile={navigateToUserProfile}
      />
      {renderDropdownMenu()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '80%',
    padding: 10,
    marginVertical: 5,
  },
  dropdownOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  dropdownMenu: {
    marginTop: 60,
    marginRight: 10,
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  editButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  closeButtonText: {
    color: '#355E3B',
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: '#355E3B',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
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
    top: 20,
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
    paddingVertical: 5,
  },
  bio: {
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
    paddingRight: 20,
    //marginLeft: 20,
    //marginRight: 20,
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
