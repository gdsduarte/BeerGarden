import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = () => {
    // handle search logic here
  };

  return (
    <View>
      <Text>Search for Beers</Text>
      <TextInput
        placeholder="Search by name, style, or brewery"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
};

export default SearchScreen;
