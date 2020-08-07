import React, {useCallback, useEffect, useRef} from 'react';
import {Animated, Easing} from "react-native";
import axios from 'axios';
import {Navigation} from "react-native-navigation";
import Ionic from 'react-native-vector-icons/Ionicons';



const View = Animated.View;
const Image = Animated.Image;

/*

 */

const SplashCheker = () => {

    const rotateRef = useRef<Animated.AnimatedValue>(new Animated.Value(0)).current;

    const onAnimated = useCallback(() => {
        Animated.loop(
            Animated.timing(rotateRef,{
                toValue:1,
                duration:3000,
                easing:Easing.linear,
                useNativeDriver:true
            })
        ).start()
    },[])
    const onFetch = useCallback(() => {
        axios.get('https://api-geolocation.zeit.sh',{timeout:10000}).then((results) => {
            if (results.data.country === "Indonesia") {
                Promise.all([
                    Ionic.getImageSource('home',20,'#fff'),
                    Ionic.getImageSource('list',20,'#fff')
                ]).then((icon) => {
                    Navigation.setRoot({
                        root:{
                            bottomTabs:{
                                children:[
                                    {
                                        stack:{
                                            children:[{component:{name:'com.home'}}],
                                            options: {
                                                bottomTab: {
                                                    icon: icon[0]
                                                },
                                            }
                                        }
                                    },
                                    {
                                        stack:{
                                            children: [{component: {name:'com.history'}}],
                                            options:{
                                                bottomTab:{
                                                    icon:icon[1]
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
            } else {
                Navigation.setRoot({
                    root:{
                        component:{
                            name:'com.pixabay'
                        }
                    }
                })
            }
        }).catch(() => {})
    },[])

    useEffect(onFetch,[])
    useEffect(onAnimated,[])

    return (
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <Image style={{
                height:150,
                width:150,
                transform:[{
                    rotate:rotateRef.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                    })
                }]
            }} source={require('../assets/logo.png')}/>
        </View>
    )
}

export default SplashCheker;