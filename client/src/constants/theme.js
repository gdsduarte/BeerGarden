/**
 * This file contains the theme object which contains all the styles for the app.
 * It also contains the window object which contains the width and height of the window.
 */

import colors from './colors';
import fonts from './fonts';
import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

export const theme = {
  colors,
  fonts,
  window: {
    width,
    height,
  },
};
