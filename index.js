import {Navigation} from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import Smaato from 'react-native-smaato-ad';
import SKDX from 'react-native-sdkx';
import SplashCheker from './src/SplashCheker';
import Pixabay from './src/pixabay';
//Westmanga
import Home from './src/home';
import List from './src/list';
import Postid from './src/postid';
import onView from './src/webview';
import History from './src/history';
import Search from './src/search';
import Details from './src/details';
import Bookmark from './src/bookmark';

Smaato.init('1100044945');
SKDX.initialize('45921653');
Smaato.setAge(35);
Smaato.setCoppa(true);
Smaato.setLanguage('en');
Smaato.setSearchQuery('covid19,bitcoin, lamborghini, san-francisco,');

SKDX.MopubAds(false);
SKDX.setFacebookAds(false);
SKDX.setDebug(false);
const lat = [
  {lat: 40.73061, long: -73.935242},
  {lat: 35.652832, long: 139.839478},
  {lat: -31.083332, long: 150.916672},
  {lat: -6.17511, long: 106.865036},
];
const random = Math.floor(Math.random() * lat.length);
Smaato.setLatLng(lat[random].lat, lat[random].long, 100);

Navigation.registerComponent('com.splash', () => SplashCheker);
Navigation.registerComponent('com.pixabay', () => Pixabay);
Navigation.registerComponent('com.home', () => Home);
Navigation.registerComponent('com.list', () => List);
Navigation.registerComponent('com.postid', () => Postid);
Navigation.registerComponent('com.webview', () => onView);
Navigation.registerComponent('com.history', () => History);
Navigation.registerComponent('com.search', () => Search);
Navigation.registerComponent('com.details', () => Details);
Navigation.registerComponent('com.bookmark', () => Bookmark);

Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'com.splash',
      },
    },
  });
});

Navigation.events().registerComponentDidAppearListener(
  ({componentType, passProps, componentName}) => {
    if (componentType === 'Component') {
      // analytics().setCurrentScreen(componentName, componentType);
      analytics().logScreenView({
        screen_class: componentName,
        screen_name: componentName,
      });
      if (Object.keys(passProps).length > 0 && componentName === 'com.postid') {
        analytics().logEvent('manga', passProps);
      }
    }
  },
);

Navigation.setDefaultOptions({
  layout: {
    backgroundColor: '#000',
  },
  bottomTabs: {
    titleDisplayMode: 'alwaysHide',
    backgroundColor: '#000',
  },
  bottomTab: {
    selectedIconColor: 'red',
  },
  topBar: {
    title: {
      color: '#fff',
    },
    backButton: {
      color: '#fff',
    },
    background: {
      color: '#000',
    },
  },
});
