import admob, {MaxAdContentRating} from '@react-native-firebase/admob';
export {default as BannerAd} from './Banner';

admob().setRequestConfiguration({
  maxAdContentRating: MaxAdContentRating.MA,
  tagForChildDirectedTreatment: false,
  tagForUnderAgeOfConsent: false,
});
