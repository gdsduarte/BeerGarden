import React, {useContext, useState, useEffect} from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  TextInput,
} from 'react-native';
import AuthContext from '@contexts/AuthContext';
import {useGroups} from '@hooks';
import {fetchUserDetailsById} from '../../hooks/customer/useReservationActions';
import Icon from 'react-native-vector-icons/FontAwesome';

const SearchHeader = ({
  searchActive,
  setSearchActive,
  setSearchQuery,
  searchQuery,
}) => {
  const handleIconPress = () => {
    if (searchQuery) {
      setSearchQuery('');
      setSearchActive(false); 
    } else {
      setSearchActive(true); 
    }
  };

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {searchActive && (
        <TextInput
          autoFocus
          placeholder="Search..."
          onBlur={() => {
            if (!searchQuery) {
              setSearchActive(false);
            }
          }}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          value={searchQuery}
        />
      )}
      <TouchableOpacity onPress={handleIconPress}>
        <Icon
          name={searchQuery ? 'times' : 'search'}
          style={styles.icon}
          size={20}
          color="#000"
        />
      </TouchableOpacity>
    </View>
  );
};

const PubChatScreen = ({navigation}) => {
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SearchHeader
          searchActive={searchActive}
          setSearchActive={setSearchActive}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />
      ),
    });
  }, [navigation, searchActive, searchQuery]);

  return (
    <View style={styles.container}>
      <FriendsChat searchQuery={searchQuery} navigation={navigation} />
    </View>
  );
};

const FriendsChat = ({searchQuery, navigation}) => {
  const {currentUserId} = useContext(AuthContext);
  const allChats = useGroups(currentUserId, 'private');
  const [filteredChats, setFilteredChats] = useState([]);

  useEffect(() => {
    const fetchDetailsAndFilter = async () => {
      const promises = allChats.map(async chat => {
        const targetUserId = chat.members.find(
          member => member !== currentUserId,
        );
        const userDetails = await fetchUserDetailsById(targetUserId);
        return {...chat, userDetails};
      });
      const chatsWithDetails = await Promise.all(promises);

      // Filter chats based on the search query comparing against userDetails.displayName
      const filtered = chatsWithDetails.filter(({userDetails}) =>
        userDetails.displayName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );

      setFilteredChats(filtered);
    };

    if (searchQuery.trim()) {
      fetchDetailsAndFilter();
    } else {
      // No search query, display all chats
      Promise.all(
        allChats.map(async chat => {
          const targetUserId = chat.members.find(
            member => member !== currentUserId,
          );
          const userDetails = await fetchUserDetailsById(targetUserId);
          return {...chat, userDetails};
        }),
      ).then(setFilteredChats);
    }
  }, [allChats, searchQuery, currentUserId]);

  return (
    <FlatList
      data={filteredChats}
      renderItem={({item}) => (
        <FriendChatItem item={item} navigation={navigation} />
      )}
      keyExtractor={item => item.id}
    />
  );
};

const FriendChatItem = ({item, navigation}) => {
  const {currentUserId} = useContext(AuthContext);
  const targetUserId = item.members.find(member => member !== currentUserId);

  console.log('FriendChatItem:', item.type);
  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        navigation.navigate('SpecificChat', {
          chatId: item.id,
          chatType: item.type,
          currentUserId,
          displayName: item.userDetails?.displayName,
          targetUserId,
          //groupData: item,
        });
      }}>
      <Image source={{uri: item.userDetails.photoUrl}} style={styles.avatar} />
      <View style={styles.chatDetails}>
        <Text style={styles.chatTitle}>{item.userDetails.displayName}</Text>
        <Text style={styles.chatSnippet}>{item.lastMessage?.messageText}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 20,
  },
  searchInput: {
    width: 200,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
    borderWidth: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f1e7',
  },
  chatItem: {
    backgroundColor: '#355E3B',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatDetails: {
    flex: 1,
  },
  chatTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatSnippet: {
    color: '#FFF',
    fontSize: 14,
  },
});

export default PubChatScreen;
