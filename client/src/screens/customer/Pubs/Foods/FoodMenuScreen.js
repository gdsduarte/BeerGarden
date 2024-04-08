/**
 * A screen component for displaying the food menu of a pub.
 * It shows a list of food items grouped by categories.
 * Users can click on a food item to view its details.
 * Owners can add new categories and items to the menu.
 */

import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import FoodCard from '@components/common/FoodCard';
import {useFoodMenu} from '@hooks';
import {useNavigation} from '@react-navigation/native';
import Loading from '@components/common/Loading';
import {useAuth} from '@contexts/AuthContext';

// Component for the category tabs
const CategoryTabs = ({categories, onSelectCategory, currentCategory}) => {
  return (
    <FlatList
      data={categories}
      renderItem={({item}) => (
        <TouchableOpacity
          style={[styles.tab, item === currentCategory && styles.activeTab]}
          onPress={() => onSelectCategory(item)}>
          <Text style={styles.tabText}>{item}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={item => item}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsContainer}
    />
  );
};

const FoodMenuScreen = ({pubId, image}) => {
  const {foodItems, loading, error} = useFoodMenu(pubId);
  const navigation = useNavigation();
  const {userRole} = useAuth();

  // Dynamically extract and order categories with predefined ones first
  const categories = useMemo(() => {
    const predefinedOrder = [
      'Appetizers',
      'Soups',
      'Salads',
      'Main Course',
      'Pasta',
      'Pizzas',
      'Sandwiches',
      'Burgers',
      'Vegetarian',
      'Vegan',
      'Seafood',
      'Sides',
      'Kids’ Menu',
      'Desserts',
      'Specials',
    ];
    const categorySet = new Set(foodItems.map(item => item.category));
    const unorderedCategories = Array.from(categorySet);

    // Sort the categories based on the predefined order
    const orderedCategories = predefinedOrder
      .filter(cat => categorySet.has(cat))
      .concat(
        unorderedCategories
          .filter(cat => !predefinedOrder.includes(cat))
          .sort(),
      );
    return orderedCategories;
  }, [foodItems]);

  // State for the current category
  const [currentCategory, setCurrentCategory] = useState('');

  // Update the currentCategory based on the categories array
  useEffect(() => {
    if (categories.length > 0) {
      // Set the current category to the first item from the sorted categories
      setCurrentCategory(categories[0]);
    }
  }, [categories]);

  // Filter foodItems based on the selected category
  const filteredItems = foodItems.filter(
    item => item.category === currentCategory,
  );

  if (error) return <Text>Menu not found.</Text>;
  if (loading) return <Loading />;

  // Handle the press event for a food item
  const handlePress = item => {
    navigation.navigate('FoodNavigator', {
      screen: 'FoodDetails',
      params: {item},
    });
    console.log('Pressed item:', item);
  };

  // Render each food item as a FoodCard component
  const renderItem = ({item}) => (
    <FoodCard item={item} onPress={() => handlePress(item)} />
  );

  return (
    <View style={styles.container}>
      <Image source={{uri: image}} style={styles.image} />
      <CategoryTabs
        categories={categories}
        onSelectCategory={setCurrentCategory}
        currentCategory={currentCategory}
      />
      {userRole === 'owner' && (
        <Button
          title="Add Category"
          onPress={() => {
            /* TODO: Implement add category logic */
          }}
        />
      )}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.flatlist}
      />
      {userRole === 'owner' && (
        <Button
          title="Add Item"
          onPress={() => {
            /* TODO: Implement add item logic */
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f1e7',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  tab: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'lightgray',
    height: 40,
    marginBottom: 15,
  },
  activeTab: {
    backgroundColor: 'gray',
  },
  tabText: {
    color: 'white',
  },
  flatlist: {
    height: '100%',
    marginTop: 10,
  },
});

export default FoodMenuScreen;
