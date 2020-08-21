import React, {useCallback, useLayoutEffect, useState} from "react";
import {Pressable, StyleSheet, Text} from "react-native";
import {_getPostsId} from "../../utils/api";
import {Navigation as navigation} from 'react-native-navigation'
import {_getHistoryId, _setHistoryId} from "../../utils/database/HistoryId";

interface props extends _getPostsId{
    root?:string
    componentId?:string
}

export default React.memo((props:props) => {

    const [mod,setMod] = useState<boolean>(false);

    const onPress = useCallback(() => {
       Promise.all([
           navigation.push(props.componentId,{
               component:{
                   name:'com.webview',
                   passProps:props,
                   options:{
                       topBar:{
                           visible:false
                       },
                       // statusBar:{
                       //     visible:false
                       // },
                       bottomTabs:{
                           visible:false
                       }
                   }
               }
           }),
           _setHistoryId(props.id)
       ]).then((results) => {
           if (results[1] !== mod) {
               setMod(true);
           }
       }).catch(() => {})
    },[mod])

    const onLayout = useCallback(() => {
        _getHistoryId(props.id).then((res) => {
            if (res) {
                setMod(true);
            }
        }).catch((error) => {
            if (!error) return;
        })
    },[])

    useLayoutEffect(onLayout,[]);

    return (
        <Pressable style={state => [
            state.pressed ?
                {backgroundColor:'rgba(255,255,255,.2)'} : {backgroundColor:'transparent'},styles.container
        ]} onPress={onPress}>
            <Text style={{ color:mod ? 'rgba(255,255,255,.5)' : 'white' }}>{props.title}</Text>
            <Text style={[styles.text,styles.size9]}>{props.time}</Text>
        </Pressable>
    )
},(prev,next) => {
    return  prev.id === next.id;
    return true;
})


const styles = StyleSheet.create({
    container:{
        height:40,
        paddingHorizontal:8,
        marginVertical:2
    },
    text:{
        color:'white'
    },
    size9:{
        fontSize:10,
        color:'rgba(255,255,255,.5)'
    }
})
