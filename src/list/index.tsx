import React, {useCallback, useEffect, useRef} from 'react'
import {Animated, DrawerLayoutAndroid, Pressable, StyleSheet} from "react-native";
import {Navigation} from "react-native-navigation";
import {_getGenre, _getGenreSource, _getList, _getPaginado, _getSearch} from "../../utils/api";
import {useImmer} from "use-immer";
import CardSearch from "../ui/CardSearch";
import Loading from "../ui/Loading";

interface states {
    data:_getSearch[]
    genre:Array<{
        id:string
        title:string
    }>
    current:number
    total:number
    currentGenre?:string | null
}

const View = Animated.View;
const FlatList = Animated.FlatList;
const Text = Animated.Text;
const ScrollView = Animated.ScrollView;

const List = (props:any) => {

    const [state,setState] = useImmer<states>({
        data:[],
        genre:[],
        current:1,
        total:0,
        currentGenre:null
    });
    const drawerRef = useRef<any>();
    const refEvent = useRef<any>();
    const FlatRef = useRef<any>();
    const scrollY = useRef<Animated.AnimatedValue>(new Animated.Value(0)).current;

    const onFetch = useCallback( () => {
        _getList().then((res) => {
            setState(draft => {
                draft.data = res;
            })
        }).catch(() => {});
        _getPaginado().then((res) => {
            setState(draft => {
                draft.total = res;
            })
        }).catch(() => {});
        _getGenre().then((res) => {
           setState(draft => {
               draft.genre = res
           })
        })
    },[])

    const onCallView = useCallback(() => {
        const listener = {
            componentDidAppear:() => {
                Navigation.mergeOptions(props.componentId,{
                    topBar:{
                        title:{text:'LIST',fontSize:14,color:'#fff'},
                        rightButtons:[{
                            id:'filter-list',
                            text:'filter',
                            color:'white'
                        }]
                    }
                });
                refEvent.current = Navigation.events().registerNavigationButtonPressedListener(({buttonId}) => {
                    if (buttonId === "filter-list") {
                        drawerRef.current.openDrawer();
                    }
                })
            },
            componentDidDisappear:() => {
                if (refEvent.current != null) {
                    refEvent.current.remove();
                }
            }
        }

        const unsubscribe = Navigation.events().registerComponentListener(listener, props.componentId);
        return () => {
            unsubscribe.remove();
        }
    },[])

    useEffect(onCallView,[])
    useEffect(onFetch,[])

    const renderContent = useCallback(({item}) => {
        return (
            <CardSearch componentId={props.componentId} {...item} />
        )
    },[])

    const EndReached = useCallback(() => {
        if (state.current < state.total) {
           _getList(state.current + 1).then((results) => {
               setState(draft => {
                   draft.current = draft.current + 1;
                   draft.data = draft.data.concat(results);
               })
           }).catch(() => {})
        }
    },[state]);
    const GenreId = useCallback((item,index) => {

        return (
            <Pressable onPress={() => {
                setState(draft => {
                    draft.currentGenre = item.id;
                })
                scrollY.setValue(0);
            }} key={index} style={{
                backgroundColor:state.currentGenre === item.id ? 'rgb(217,19,42)' : 'white',
                borderRadius:5,
                margin:5/2,
                minHeight:10,
                padding:5
            }}>
                <Text style={{color:state.currentGenre === item.id ? 'white' : 'black' }}>{item.title}</Text>
            </Pressable>
        )
    },[state.currentGenre])

    const onSave = useCallback(() => {
        drawerRef.current.closeDrawer();
        _getGenreSource(state.currentGenre).then((results) => {
           setState(draft => {
               draft.data = results;
           })
           FlatRef.current.scrollToOffset({animated:true,viewPosition:0})
        }).catch(() => {})
    },[state.currentGenre])

    const NavigationView = useCallback(() => {
        return (
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                    <ScrollView
                        onScroll={Animated.event([{
                            nativeEvent:{
                                contentOffset:{
                                    y:scrollY
                                }
                            }
                        }],{useNativeDriver:true})}
                        scrollEventThrottle={0.1} showsVerticalScrollIndicator={false}>
                        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                        {state.genre.map((item,index) => {
                            return GenreId(item,index);
                        })}
                        </View>
                    </ScrollView>
                </View>
                <View style={[styles.footerDrawer,{
                    transform:[{
                        translateY:scrollY.interpolate({
                            extrapolate:'clamp',
                            inputRange:[0,50],
                            outputRange:[0,50]
                        })
                    }]
                }]}>
                    <Pressable style={styles.btnDrawer} onPress={() => {
                        drawerRef.current.closeDrawer()
                    }}>
                        <Text style={{color:'white'}}>CLOSE</Text>
                    </Pressable>
                    <Pressable onPress={onSave} style={styles.btnDrawer}>
                        <Text style={{color:'white'}}>SAVE</Text>
                    </Pressable>
                </View>
            </View>
        )
    },[state])


    return (
        <DrawerLayoutAndroid
            ref={drawerRef}
            // @ts-ignore
            drawerPosition={'right'}
            // drawerBackgroundColor="rgba(0,0,0,0.5)"
            drawerWidth={230} renderNavigationView={NavigationView}>
        <View style={{flex:1}}>
            <FlatList
                ref={FlatRef}
                data={state.data || []}
                renderItem={renderContent}
                numColumns={3}
                onEndReachedThreshold={0.1}
                onEndReached={EndReached}
                ListEmptyComponent={() => (<Loading/>)}
            />
        </View>
        </DrawerLayoutAndroid>
    )
}

const styles = StyleSheet.create({
    footerDrawer:{
        position:'absolute',
        bottom:0,
        width:'100%',
        height:50,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
        backgroundColor:'white'
    },
    btnDrawer:{
        height:30,
        backgroundColor:'rgb(217,19,42)',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:5,
        borderRadius:5
    }
})

export default List;