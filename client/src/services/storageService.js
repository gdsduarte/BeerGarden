/**
 * This service is used to upload photos to Firebase Storage.
 */

import storage from '@react-native-firebase/storage';

const uploadPhotoToFirebaseStorage = async (filePath) => {
  const uploadUri = filePath;
  let fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
  const extension = fileName.split('.').pop(); 
  const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
  fileName = `${nameWithoutExtension}_${new Date().getTime()}.${extension}`;

  const storageRef = storage().ref(`groupPhotos/${fileName}`);

  try {
    await storageRef.putFile(uploadUri);
    const url = await storageRef.getDownloadURL();
    console.log('File uploaded and URL fetched:', url);
    return url;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export {uploadPhotoToFirebaseStorage};
