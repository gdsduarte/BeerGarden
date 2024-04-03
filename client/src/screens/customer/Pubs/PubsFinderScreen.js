// Dummy Screen to find pubs

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const PubsFinderScreen = () => {
  return (
    <View>
      <Text>Pub Finder Screen</Text>
    </View>
  );
};

export default PubsFinderScreen;



/* import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {PubCard} from '@components';
import {getPubs} from '@actions';
import {colors} from '@styles';

const PubsFinderScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {pubs, loading} = useSelector((state) => state.pub);

  useEffect(() => {
    dispatch(getPubs());
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={pubs}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <PubCard pub={item} navigation={navigation} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default PubsFinderScreen; */