/**
 * Custom hook to fetch items from a Firestore collection and filter them by search term and/or category.
 * This hook also fetches the pub details for each item that has a pubId.
 */

import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

const useFinder = (collection, searchTerm, filter) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = firestore().collection(collection);

    // Filter by search term if provided
    if (searchTerm.trim()) {
      const searchKeyword = searchTerm.toLowerCase();
      query = query.where('searchKeywords', 'array-contains', searchKeyword);
    }

    // Filtering logic based on the filter parameter
    if (filter) {
      switch (filter) {
        case 'beers':
          query = query.where('category', '==', 'beer');
          break;
        case 'pubs':
          query = query.where('category', '==', 'pub');
          break;
        case 'foods':
          query = query.where('type', '==', 'food');
          break;
        case 'events':
          query = query.where('category', '==', 'event');
          break;
        case 'drinks':
          query = query.where('type', '==', 'drink');
          break;
        default:
          return true;
      }
    }

    // Fetch the items
    const fetchItems = async () => {
      try {
        const response = await query.get();
        let fetchedItems = response.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch pub details for items with a pubId
        const pubDetailsPromises = fetchedItems.map(async item => {
          if (item.pubId) {
            const pubRef = firestore().collection('pub').doc(item.pubId);
            const pubDoc = await pubRef.get();
            if (pubDoc.exists) {
              // Add pub details to the item list
              return {
                ...item,
                pub: pubDoc.data(),
              };
            }
          }
          return item;
        });

        // Wait for all pub details fetch operations to complete
        fetchedItems = await Promise.all(pubDetailsPromises);

        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching items and pub details:', error);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchItems();
  }, [collection, searchTerm, filter]);

  return {items, loading};
};

export default useFinder;
