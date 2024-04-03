/**
 * SearchModal is a modal that displays a search bar and a list of pubs that match the search query.
 */

import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const SearchModal = ({visible, onClose, pubs}) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPubs, setFilteredPubs] = useState(pubs);

  useEffect(() => {
    setFilteredPubs(
      pubs.filter(pub =>
        pub.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [searchQuery, pubs]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search for pubs..."
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
          <FlatList
            data={filteredPubs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.pubItem}
                onPress={() => {
                  navigation.navigate('PubScreen', {pubId: item.id});
                  onClose(); // Close the modal
                }}>
                <Image source={{uri: item.image}} style={styles.cardImage} />
                  <Text style={styles.cardText}>{item.name}</Text>
                  <Text style={styles.cardText}>{`${item.distance.toFixed(
                    1,
                  )} km`}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              onClose();
              setSearchQuery('');
            }}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
    height: '90%',
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
  searchBar: {
    width: '70%',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
  },
  pubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cardText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default SearchModal;
