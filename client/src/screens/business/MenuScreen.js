import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
//import { MenuItem } from './MenuItem'; // Component to render each menu item
//import { fetchMenuItems, deleteMenuItem } from '../services/menuService'; // Adjust path and implementation

const MenuScreen = ({ type }) => { // 'type' would be either 'drinks' or 'foods'
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const loadMenuItems = async () => {
      const items = await fetchMenuItems(type);
      setMenuItems(items);
    };
    loadMenuItems();
  }, [type]);

  const handleDelete = async (id) => {
    await deleteMenuItem(id);
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MenuItem item={item} onDelete={handleDelete} />
        )}
      />
      {/* Add buttons for adding/updating items here */}
    </View>
  );
};

// Define `DrinkMenuScreen` and `FoodMenuScreen` based on `MenuTypeScreen`
// by passing the appropriate 'type' prop

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default MenuScreen;
