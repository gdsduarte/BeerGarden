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
import {useDrinkMenu} from '@hooks';
import {useNavigation} from '@react-navigation/native';
import Loading from '@components/common/Loading';
import {useAuth} from '@contexts/AuthContext';

const CategoryTabs = ({categories, onSelectCategory, currentCategory}) => {
  return (
    <FlatList 
      data={categories}
      renderItem={({item}) => (
        <TouchableOpacity
          style={[
            styles.tab,
            item === currentCategory && styles.activeTab,
          ]}
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

const DrinkMenuScreen = ({pubId, image}) => {
  const {drinkItems, loading, error} = useDrinkMenu(pubId);
  const navigation = useNavigation();
  const {userRole} = useAuth();

  // Dynamically extract and order categories with predefined ones first
  const categories = useMemo(() => {
    const predefinedOrder = [
      'Beer',
      'Wine',
      'Cocktails',
      'Mocktails',
      'Soft Drinks',
      'Hot Drinks',
      'Drinks',
      'Spirits',
      'Liquors',
      'Shots',
      'Others',
      'Non-Alcoholic',
      'Alcoholic',
      'Cold Drinks',
      'Specials',
      'Special Offers',
      'Happy Hour',
      'Promotions',
      'Deals',
      'Discounts',
      'Offers',
      'Seasonal',
      'Limited Time',
      'New Arrivals',
    ];
    const categorySet = new Set(drinkItems.map(item => item.category));
    const unorderedCategories = Array.from(categorySet);
    const orderedCategories = predefinedOrder
      .filter(cat => categorySet.has(cat))
      .concat(
        unorderedCategories
          .filter(cat => !predefinedOrder.includes(cat))
          .sort(),
      );
    return orderedCategories;
  }, [drinkItems]);

   // State for the current category
   const [currentCategory, setCurrentCategory] = useState('');

  // Update the currentCategory based on the categories array
  useEffect(() => {
    if (categories.length > 0) {
      // Set the current category to the first item from the sorted categories
      setCurrentCategory(categories[0]);
    }
  }, [categories]);

  // Filter drinkItems based on the selected category
  const filteredItems = drinkItems.filter(
    item => item.category === currentCategory,
  );

  if (error) return <Text>Menu not found.</Text>;
  if (loading) return <Loading />;

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
            /* Implement add category logic */
          }}
        />
      )}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatlist}
      />
      {userRole === 'owner' && (
        <Button
          title="Add Item"
          onPress={() => {
            /* Implement add item logic */
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

export default DrinkMenuScreen;
