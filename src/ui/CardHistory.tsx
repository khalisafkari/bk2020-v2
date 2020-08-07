import React, {useCallback, useEffect} from "react";
import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import {_getHistroyById, historyPost} from "../../utils/database/HistoryId";
import {useImmer} from "use-immer";
import FastImage from "react-native-fast-image";
import {Navigation} from "react-native-navigation";

interface props {
    keys?:string
    componentId?:string
}


const CardHistory = (props:props) => {

    const [state,setState] = useImmer<historyPost>({
        id:'',
        image:'',
        last_id:'',
        last_title:'',
        title:''
    })

    const getContent = useCallback(() => {
        _getHistroyById(props.keys).then((results) => {
            setState(draft => {
                draft.id = results.id;
                draft.title = results.title;
                draft.image = results.image;
                draft.last_title = results.last_title;
            })
        }).catch(() => {

        })
    },[])

    useEffect(getContent,[])

    const onPress = useCallback(() => {
        if (state.id && state.title && state.image) {
            Navigation.push(props.componentId,{
                component:{
                    name:'com.postid',
                    passProps:state,
                    options:{
                        statusBar:{
                            visible:true
                        },
                        topBar:{
                            visible:true,
                            title:{
                                text:state.title
                            }
                        },
                        bottomTabs:{
                            visible:false
                        }
                    }
                }
            })
        }
    },[state])

    return (
        <Pressable style={styles.container} onPress={onPress}>
            <FastImage source={{uri:state.image,priority:FastImage.priority.normal}} style={styles.image} />
            <View>
                <Text numberOfLines={1} style={styles.title}>{state.title}</Text>
                <Text numberOfLines={1} style={styles.label}>{state.last_title ? state.last_title : 'nothing'}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1/3,
        margin:5,
        height:170
    },
    title:{
        color:'#fff'
    },
    image:{
        height:140,
        width:'100%'
    },
    label:{
        fontSize:11,
        color:'rgba(255,255,255,.5)'
    },
})

export default CardHistory;