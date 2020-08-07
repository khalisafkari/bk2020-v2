import React from "react";
import FastImage from "react-native-fast-image";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {_getHomeSekte} from "../../utils/sektekomik";

interface props extends _getHomeSekte{

}

const CardSekteHome = (props:props) => {
    return (
        <Pressable style={styles.container}>
            <FastImage source={{uri:props.image}} style={styles.image} />
            <View>
                <Text numberOfLines={1} style={styles.title}>{props.title}</Text>
                <Text numberOfLines={1} style={styles.label}>{props.chapter}</Text>
                <Text numberOfLines={1} style={styles.label}>{props.time}</Text>
            </View>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    container:{
        // width:(Dimensions.get('window').width / 3) * 0.90,
        flex:1/3,
        margin:5,
        height:190
    },
    image:{
        height:140,
        width:'100%'
    },
    title:{
        color:'#fff'
    },
    label:{
        fontSize:11,
        color:'rgba(255,255,255,.5)'
    },
})

export default React.memo(CardSekteHome,(prev,next) => {
    return prev.id === next.id;
    return true;
})