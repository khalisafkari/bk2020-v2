import {Navigation} from 'react-native-navigation';
import Ionic from 'react-native-vector-icons/Ionicons'

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
import AdBanner from "./src/ui/AdBanner";



Navigation.registerComponent('com.home',() => Home);
Navigation.registerComponent('com.list',() => List);
Navigation.registerComponent('com.postid',() => Postid);
Navigation.registerComponent('com.webview',() => onView);
Navigation.registerComponent('com.history',() => History);
Navigation.registerComponent('com.search',() => Search);
Navigation.registerComponent('com.details',() => Details);

//Tester
Navigation.registerComponent('com.ad',() => AdBanner);

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
             bottomTabs:{
                 children:[
                     {
                         stack:{
                             children:[{component:{name:'com.home'}}],
                             options: {
                                 bottomTab: {
                                     icon: await Ionic.getImageSource('home',20,'#fff')
                                 },
                             }
                         }
                     },
                     {
                         stack:{
                             children: [{component: {name:'com.history'}}],
                             options:{
                                 bottomTab:{
                                    icon:await Ionic.getImageSource('list',20,'#fff')
                                 },
                                 topBar:{
                                     visible:false
                                 }
                             }
                         }
                     }
                 ]
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