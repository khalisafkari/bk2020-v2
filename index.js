import {Navigation} from 'react-native-navigation';
import Ionic from 'react-native-vector-icons/Ionicons'
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
//End Westmanga

//Test
// import AdBanner from "./src/ui/AdBanner";


Navigation.registerComponent('com.splash',() => SplashCheker);
Navigation.registerComponent('com.pixabay',() => Pixabay);
Navigation.registerComponent('com.home',() => Home);
Navigation.registerComponent('com.list',() => List);
Navigation.registerComponent('com.postid',() => Postid);
Navigation.registerComponent('com.webview',() => onView);
Navigation.registerComponent('com.history',() => History);
Navigation.registerComponent('com.search',() => Search);
Navigation.registerComponent('com.details',() => Details);

//Tester
// Navigation.registerComponent('com.ad',() => AdBanner);

// Navigation.events().registerAppLaunchedListener(async () => {
//     Navigation.setRoot({
//         root:{
//             stack:{
//                 children:[{
//                     component:{
//                         name:'com.ad'
//                     }
//                 }]
//             }
//         }
//     })
// })

Navigation.events().registerAppLaunchedListener(async () => {
        Navigation.setRoot({
            root:{
                component:{
                    name:'com.splash'
                }
            }
        })
})

// Navigation.events().registerAppLaunchedListener(async () => {
//     Navigation.setRoot({
//         root:{
//             stack:{
//                 children:[{
//                     component:{
//                         name:'com.sekte.home'
//                     }
//                 }]
//             }
//         }
//     })
// })

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