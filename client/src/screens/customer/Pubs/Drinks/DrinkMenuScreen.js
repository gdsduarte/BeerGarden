import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native';
import FoodCard from '../../../../components/common/FoodCard';
import {useDrinkMenu} from '../../../../hooks';
import {useNavigation} from '@react-navigation/native';
import Loading from '../../../../components/common/Loading';

const DrinkMenuScreen = ({pubId}) => {
  const {drinkItems, loading, error} = useDrinkMenu(pubId);
  const navigation = useNavigation();

  if (error) return <Text>Menu not found.</Text>;
  if (loading) {
    return <Loading />;
  }
  if (drinkItems.length === 0) {
    return <Text>No drinks found.</Text>;
  }

  const handlePress = item => {
    navigation.navigate('DrinkNavigator', {
      screen: 'DrinkDetails',
      params: {item},
    });
  };

  const renderItem = ({item}) => (
    <FoodCard item={item} onPress={() => handlePress(item)} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={drinkItems}
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

export default DrinkMenuScreen;
