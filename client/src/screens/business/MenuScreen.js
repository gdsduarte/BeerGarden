import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
//import { MenuItem } from './MenuItem';
//import { fetchMenuItems, deleteMenuItem } from '../services/menuService';

const MenuScreen = ({ type }) => {
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default MenuScreen;
