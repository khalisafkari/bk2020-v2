import './registery';
import {Navigation} from 'react-native-navigation';


Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'com.splash',
      },
    },
  });
});
