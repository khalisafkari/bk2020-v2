import {Navigation} from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import Smaato from 'react-native-smaato-ad';
import SplashCheker from "./src/SplashCheker";
import Pixabay from "./src/pixabay";
//Westmanga
import Home from "./src/home";
import List from "./src/list";
import Postid from "./src/postid";
import onView from "./src/webview";
import History from "./src/history";
import Search from "./src/search";
import Details from "./src/details";
import Bookmark from "./src/bookmark";

Smaato.init("1100044945");

Navigation.registerComponent('com.splash',() => SplashCheker);
Navigation.registerComponent('com.pixabay',() => Pixabay);
Navigation.registerComponent('com.home',() => Home);
Navigation.registerComponent('com.list',() => List);
Navigation.registerComponent('com.postid',() => Postid);
Navigation.registerComponent('com.webview',() => onView);
Navigation.registerComponent('com.history',() => History);
Navigation.registerComponent('com.search',() => Search);
Navigation.registerComponent('com.details',() => Details);
Navigation.registerComponent('com.bookmark',() => Bookmark);

Navigation.events().registerAppLaunchedListener(async () => {
        Navigation.setRoot({
            root:{
                component:{
                    name:'com.splash'
                }
            }
        })
});

Navigation.events().registerComponentDidAppearListener(({componentType,passProps,componentName}) => {
    if (componentType === "Component") {
        analytics().setCurrentScreen(componentName,componentType);
        if (Object.keys(passProps).length > 0 && componentName === "com.postid") {
           analytics().logEvent('manga',passProps)
        }
    }
})

Navigation.setDefaultOptions({
    layout:{
        backgroundColor:'#000'
    },
    bottomTabs:{
        titleDisplayMode:'alwaysHide',
        backgroundColor:'#000',
    },
    bottomTab:{
        selectedIconColor:'red',
    },
    topBar:{
        title:{
            color:'#fff'
        },
        backButton:{
            color:'#fff'
        },
        background:{
            color:'#000'
        }
    }
})
