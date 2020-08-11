import React, {useCallback, useEffect, useRef} from "react";
import {Animated, Pressable, StyleSheet} from "react-native";
import {_getAllBookmark} from "../../utils/database/sqlite";
import {Navigation} from "react-native-navigation";
import {useImmer} from "use-immer";
import CardSearch from "../ui/CardSearch";
import Ionic from "react-native-vector-icons/Ionicons";

interface states {
    currentPage?:number
    data:Array<{
        id:string
        title:string
        image:string
        last_id:string
        last_title:string
    }>
    totalPages?:number
}

const View = Animated.View;
const FlatList = Animated.FlatList;
const Text = Animated.Text;

const Bookmark = (props:any) => {
    const [state,setState] = useImmer<states>({
        data:[],
        currentPage:1,
        totalPages:0
    });
    const refScollArrow = useRef<Animated.AnimatedValue>(new Animated.Value(0)).current;
    const onFetch = useCallback(() => {
        const listener = {
            componentDidAppear:() => {
               _getAllBookmark().then((results) => {
                   setState(draft => {
                       draft.currentPage = results.currentPage;
                       draft.data = results.data;
                       draft.totalPages = results.totalPages;
                   });
               }).catch(() => {});
               Navigation.mergeOptions(props.componentId,{
                   topBar:{
                       title:{
                           text:'BOOKMARK',
                           color:'white',
                       }
                   }
               })
            },
            componentDidDisappear:() => {
                Animated.timing(refScollArrow,{
                    toValue:0,
                    useNativeDriver:true,
                    duration:2000
                }).start()
            }
        };
        const unsubscribe = Navigation.events().registerComponentListener(listener, props.componentId);
        return () => {
            if (unsubscribe) {
                unsubscribe.remove();
            }
        }
    },[]);
    useEffect(onFetch,[]);
    const renderContent = useCallback(({item}) => {
        return (<CardSearch componentId={props.componentId} {...item} />)
    },[]);
    const keyVirtual = useCallback((item) => {
        return `virtual-id-${item.id}`
    },[]);
    const arrowPull = useCallback(() => {
        Animated.timing(refScollArrow,{
            toValue:1,
            useNativeDriver:true,
            duration:2000
        }).start()
    },[])

    return (
        <View style={{flex:1}}>
            <FlatList keyExtractor={keyVirtual} numColumns={3} data={state.data || []} renderItem={renderContent}/>
            <View style={[styles.warning,{
                transform:[{
                    translateY:refScollArrow.interpolate({
                        inputRange:[0,1],
                        outputRange:[0,-100]
                    })
                }]
            }]}>
                <Text style={{color:'white',flex:1,fontSize:14}}>
                    Langganan pro untuk mengamankan bookmark anda
                </Text>
               <Pressable onPress={arrowPull}>
                   <Ionic name={"arrow-up-circle"} color={'#fff'} size={20} />
               </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    warning:{
        position:'absolute',
        top:0,
        backgroundColor:'red',
        padding:5/2,
        flexDirection:'row',
        alignItems:'center'
    }
})

export default Bookmark;