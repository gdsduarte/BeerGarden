import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import FoodCard from '../../../components/common/FoodCard';
import useFoodMenu from '../../../hooks/useFoodMenu';
import {useNavigation} from '@react-navigation/native';

const FoodMenuScreen = ({pubId}) => {
  const {foodItems, loading, error} = useFoodMenu(pubId);
  const navigation = useNavigation();

  if (error) return <Text>Menu not found.</Text>;
  if (loading) {
    return <ActivityIndicator size="large" />;
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
