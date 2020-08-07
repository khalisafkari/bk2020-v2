import React, {useCallback, useEffect, useRef} from "react";
import {Animated, Linking, PanResponder, Pressable, StyleSheet, TextInput, useWindowDimensions} from "react-native";
import {useImmer} from "use-immer";
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import FastImage from "react-native-fast-image";
import {AppodealBanner} from 'react-native-appodeal'
import initialize from "../../utils/ad/initialisation";
const View = Animated.View;
const FlatList = Animated.FlatList;
const Text = Animated.Text;
const Image = Animated.createAnimatedComponent(FastImage)

interface states {
    data:Array<any>
}

const Pixabay = () => {

    const [state,setState] = useImmer<states>({
        data:[],
    });
    const scrollY = useRef<Animated.AnimatedValue>(new Animated.Value(0)).current;

    const initCall = useCallback(() => {
        initialize(false);
    },[])
    useEffect(initCall,[]);

    const Notice = useCallback(() => {
        return (
            <Pressable style={press => [
                {
                    backgroundColor:press ? 'black' : 'white'
                },
                styles.containerNotice
            ]}>
                <Text style={styles.pixabay}>Pixabay</Text>
                <Text style={styles.pixabaysubtitle}>All content on Pixabay can be used for free for commercial and noncommercial </Text>
            </Pressable>
        )
    },[])

    const renderContent = useCallback(({item,index}) => {


        return (
            <Pressable style={{height:300}} onPress={() => {
                Linking.openURL(item.pageURL)
            }}>
                <View style={styles.headContent}>
                    <Image source={{uri:item.userImageURL}} style={styles.avatar}/>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <View style={styles.headSubContent}>
                            <Text style={styles.headUser}>{item.user}</Text>
                            <Text  style={styles.headTags}>{item.tags}</Text>
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Icon name={'heart-circle-outline'} color={'red'} size={20}/>
                            <Text style={styles.downloadText}>{item.likes}</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <Image source={{uri:item.largeImageURL}} style={[styles.image]} />
                </View>
                <View style={styles.footerContent}>
                    <View style={styles.downloadsContainar}>
                        <Icon name={"download-outline"} color={'white'} size={15} />
                        <Text  style={styles.downloadText}>{item.downloads}</Text>
                    </View>
                    <View style={styles.downloadsContainar}>
                        <Icon name={"happy-outline"} color={'white'} size={15} />
                        <Text  style={styles.downloadText}>{item.favorites}</Text>
                    </View>
                    <View style={styles.downloadsContainar}>
                        <Icon name={"chatbox-ellipses-outline"} color={'white'} size={15} />
                        <Text style={styles.downloadText}>{item.comments}</Text>
                    </View>
                </View>
            </Pressable>
        )
    },[])

    const changeText = useCallback((text) => {
        axios.get(`https://pixabay.com/api/?key=8395946-db4a048586900d06284c1bee5&q=${text}&safesearch=true`).then((results) => {
           setState(draft => {
               draft.data = results.data.hits;
           })
        }).catch(() => {

        })
    },[state])


    return (
        <View style={{flex:1}}>
            <FlatList
                contentContainerStyle={{
                    paddingTop:60,
                }}
                onScroll={Animated.event([{
                    nativeEvent:{
                        contentOffset:{
                            y:scrollY
                        }
                    }
                }],{useNativeDriver:true})}
                data={state.data || []}
                renderItem={renderContent}
                keyExtractor={(item) => `view-id-${item.id}`}
                ListEmptyComponent={Notice}
            />
            <View style={[styles.inputContainer,{
                transform:[{
                    translateY:scrollY.interpolate({
                        inputRange:[0,50,100],
                        outputRange:[0,-25,-50]
                    }),
                }]
            }]}>
                <TextInput
                    style={{
                        flex:1,
                        marginHorizontal:5,
                        color:'white'
                    }}
                    onChangeText={changeText}
                    underlineColorAndroid={'transparent'}
                    placeholder={'search on pixabay'}
                />
                <Icon name={"search"} style={{marginHorizontal:5}} size={25} color={'white'} />
            </View>
            {state.data.length > 1 ? <AppodealBanner adSize={'phone'}/> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    containerNotice:{
        padding:10
    },
    pixabay:{
        fontSize:20,
        color:'#fff',
        fontWeight:'bold'
    },
    pixabaysubtitle:{
        fontSize:12,
        color:'#fcf4f4'
    },
    inputContainer:{
        margin:5,
        position:'absolute',
        top:0,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderRadius:10,
        paddingHorizontal:5,
        backgroundColor:'rgba(255,255,255,.5)'
    },
    image:{
        height:200,
        width:'100%',
        borderRadius:5
    },
    footerContent:{
        flexDirection:'row',
        justifyContent:'space-evenly',
    },
    downloadsContainar:{
        height:40,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    downloadText:{
        fontSize:12,
        color:'rgba(255,255,255,.6)'
    },
    headContent:{
        flexDirection:'row',
        margin:5
    },
    headSubContent:{
        paddingHorizontal:8,
        flex:1
    },
    headUser:{
        fontSize:14,
        color:'white',
        fontWeight:'bold'
    },
    headTags:{
        color:'rgba(255,255,255,.7)',
    },
    avatar:{
        height:50,
        width:50,
        borderRadius:50
    }
})

export default Pixabay;