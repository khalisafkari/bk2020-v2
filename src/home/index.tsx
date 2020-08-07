import React, {useCallback, useEffect, useRef, useState} from "react";
import {StyleSheet, Animated} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'
import Loading from "../ui/Loading";
import {_getHome} from "../../utils/api";
import Card from "../ui/Card";
import Error from "../ui/Error";
import {Navigation} from "react-native-navigation";

const View = Animated.View;
const FlatList = Animated.FlatList;

interface props {
    componentId:string
}


const Home = (props:props) => {

    const refEvent = useRef<any>();
    const [state,setState] = useState<_getHome[]>([]);
    const [error,setError] = useState<boolean>(false);

    const onCallBack = useCallback(() => {
        _getHome().then((results) => { setState(results) }).catch(() => {setError(true)});
    },[])

    const onCallNav = useCallback( () => {
        const listener = {
            componentDidAppear: async () => {
                Navigation.mergeOptions(props.componentId,{
                       topBar:{
                           title:{
                               text:'Home'
                           },
                           leftButtons:[{
                              id:'com.list',
                              text:'List',
                              icon:await Icon.getImageSource('list-outline',20,'#fff')
                           }],
                           rightButtons:[{
                               id:'com.search',
                               icon:await Icon.getImageSource('search',20,'#fff')
                           }]
                       }
                })
                refEvent.current = Navigation.events().registerNavigationButtonPressedListener(({buttonId}) => {
                    Navigation.push(props.componentId,{
                            component:{
                                name:buttonId,
                                options:{
                                    topBar:{
                                        visible:buttonId === "com.search" ? false : true,
                                    },
                                    bottomTabs:{
                                        visible:false
                                    }
                                }
                            }
                    })
                })
            },
            componentDidDisappear: () => {
                if (refEvent.current != null) {
                    refEvent.current.remove();
                }
            }
        };
        // Register the listener to all events related to our component
        const unsubscribe = Navigation.events().registerComponentListener(listener, props.componentId);
        return () => {
            unsubscribe.remove();
        };
    },[])



    useEffect(onCallBack,[]);
    useEffect(onCallNav,[]);

    const renderContent = useCallback(({item}) => {
        return (<Card {...item} componentId={props.componentId} />)
    },[])

    const renderKey = (item) => {
        return `west-${item.id}`
    }


    if (error) {
        return  (
            <Error text={'server down'} />
        )
    }

    return (
        <View style={style.container}>
            <FlatList
                data={state.length > 1 ? state.slice(0,24) : []}
                renderItem={renderContent}
                numColumns={3}
                keyExtractor={renderKey}
                ListEmptyComponent={(<Loading/>)}
            />
        </View>
    )
}

const style = StyleSheet.create({
    container:{flex:1},
    header:{
        height:45,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:8
    },
    error:{flex:1,justifyContent:'center',alignItems:'center'},
    errorLabel:{color:'white',fontSize:12,textTransform:'uppercase'}
})

export default Home;