import firestore from '@react-native-firebase/firestore';

// Function to search for pubs by name
const searchPubsByName = async query => {
  const snapshot = await firestore()
    .collection('pub')
    .where('name', '>=', query)
    .where('name', '<=', query + '\uf8ff')
    .get();

  const pubs = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  setPubResults(pubs);
};

export default searchPubsByName;