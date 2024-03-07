import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native';
import FoodCard from '../../components/common/FoodCard';
import {useFoodMenu} from '../../hooks';
import {useNavigation} from '@react-navigation/native';
import Loading from '../../components/common/Loading';

const FoodMenuScreen = ({pubId}) => {
  const {foodItems, loading, error} = useFoodMenu(pubId);
  const navigation = useNavigation();

  if (error) return <Text>Menu not found.</Text>;
  if (loading) {
    return <Loading />;
  }

  if (foodItems.length === 0) {
    return <Text>No food found.</Text>;
  }

  const handlePress = item => {
    navigation.navigate('MenuNavigator', {
      screen: 'FoodDetails',
      params: {item},
    });
  };

  const renderItem = ({item}) => (
    <FoodCard item={item} onPress={() => handlePress(item)} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={foodItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
});

export default FoodMenuScreen;
