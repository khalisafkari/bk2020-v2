import React, {useCallback, useEffect, useRef} from "react";
import {StyleSheet, Animated, Text, Pressable} from "react-native";
import FastImage from "react-native-fast-image";
import {_getDetails} from "../../utils/api";
import {useImmer} from "use-immer";
import Icon from 'react-native-vector-icons/Ionicons'
import {_delBookmark, _getBookmarkId, _setBookmark} from "../../utils/database/sqlite";


const View = Animated.View;
const ScrollView = Animated.ScrollView;
const Image = Animated.createAnimatedComponent(FastImage);

interface propsState {
    componentId:string
    id:string
    image:string
    title:string
}

const Details = (props:propsState) => {

    const onValue = useRef<Animated.AnimatedValue>(new Animated.Value(0)).current;
    const [state,setState] = useImmer<_getDetails>({
        author:'',
        genre:[],
        japan:'',
        last:'',
        rating:'',
        release_data:'',
        sinopsis:'',
        status:'',
        total:''
    });
    const [book,setBook] = useImmer<boolean>(false);
    const onCall = useCallback(() => {
        _getDetails(props.id).then((results) => {
           setState(draft => {
               draft.author = results.author;
               draft.genre = results.genre;
               draft.japan = results.japan;
               draft.last = results.last;
               draft.rating = results.rating;
               draft.release_data = results.release_data;
               draft.sinopsis = results.sinopsis;
               draft.status = results.status;
               draft.total = results.total;
           })
        }).catch(() => {

        })
    },[state.genre]);
    const onCheckBookmark = useCallback(() => {
        _getBookmarkId(props.id).then((results) => {
            if (results !== undefined) {
                setBook(() => true);
            } else {
                setBook(() => false);
            }
        }).catch(() => {
            setBook(() => false);
        })
    },[book]);
    useEffect(onCall,[]);
    useEffect(onCheckBookmark,[]);

    const onSetBookmark = useCallback(() => {
        _setBookmark(props.id,props.title,props.image).then((results) => {
            if (results.insertId > 0) {
                setBook(() => true);
            }
        }).catch(() => {
            setBook(draft => draft);
        })
    },[]);
    const onDelBookmark = useCallback(() => {
        _delBookmark(props.id).then((results) => {
            if (results.insertId === undefined) {
                setBook(() => false);
            }
        }).catch(() => {
            setBook(draft => draft);
        })
    },[]);

    return (
        <View style={{flex:1}}>
            <ScrollView onScroll={Animated.event([{
                nativeEvent:{
                    contentOffset:{
                        y:onValue
                    }
                }
            }],{useNativeDriver:true})} scrollEventThrottle={0.1} contentContainerStyle={{paddingBottom:70}}>
                <View style={{marginVertical:8,marginHorizontal:5,flexDirection:'row'}}>
                    <Image source={{uri:props.image}} style={[styles.image]} />
                    <View style={{marginHorizontal:5,flex:1}}>
                        <Text numberOfLines={2} style={[styles.title,styles.line]}>{props.title}</Text>
                        {state.japan ? (
                            <Text numberOfLines={2} style={[styles.japan]}>{state.japan}</Text>
                        ) : null}
                        {state.author ? (
                            <Text style={[styles.japan]}>Author : {state.author}</Text>
                        ) : null}
                        {state.release_data ? (
                            <Text style={[styles.japan]}>Release : {state.release_data}</Text>
                        ) : null}
                        {state.status ? (
                            <Text style={[styles.japan]}>Status : {state.status}</Text>
                        ) : null}
                        {state.last ? (
                            <Text style={[styles.japan]}>Last : {state.last}</Text>
                        ) : null}
                    </View>
                </View>
                <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'center',margin:5}}>
                    {state.genre.map((item,index) => {
                        return <Text key={index} style={[styles.japan,styles.genreItem]}>{item.title}</Text>
                    })}
                </View>
                <View style={{margin:5}}>
                    <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Sinopsis</Text>
                    <Text style={{color:'white',fontSize:11}}>{state.sinopsis}</Text>
                </View>
            </ScrollView>
            <View style={[styles.footer,{
                transform:[{
                    translateY:onValue.interpolate({
                        inputRange:[0,100],
                        outputRange:[0,50],
                        extrapolate:'clamp'
                    })
                }]
            }]}>
                <View style={styles.footerContent}>
                    {state.rating ? (
                        <View style={styles.footerStar}>
                            <Icon name={'star-half-outline'} size={15} color={'#fff'}/>
                            <Text style={{color:'white',fontSize:14,fontWeight:'bold',marginHorizontal:5}}>{state.rating}</Text>
                        </View>
                    ) : null}
                    <Pressable onPress={book ? onDelBookmark : onSetBookmark} style={styles.footerStar}>
                        <Icon name={`book-outline`} size={15} color={`${book ? 'red' : '#fff'}`} />
                        <Text  style={{color:`${book ? 'red' : '#fff'}`,fontSize:14,fontWeight:'bold',marginHorizontal:5}}>save</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image:{
        height:150,
        width:100
    },
    title:{
        color:'white',fontSize:12
    },
    line:{
        borderBottomWidth:.5,borderBottomColor:'white',marginVertical:2
    },
    japan:{
        color:'white',
        fontSize:11
    },
    genreItem:{
        height:20,
        minWidth:40,
        backgroundColor:'#3e3b3b',
        margin:1,
        padding:2,
        alignItems:'center',
        textAlign:'center',
        justifyContent:'center'
    },
    footer:{
        position:'absolute',
        bottom:0,
        backgroundColor:'#000',
        height:50,
        width:'100%'
    },
    footerContent:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginHorizontal:8
    },
    footerStar:{
        flex:1,
        alignItems:'center'
    }
})

export default Details;
