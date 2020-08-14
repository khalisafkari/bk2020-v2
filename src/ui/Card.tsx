import React from "react";
import {_getHome} from "../../utils/api";
import {Pressable, StyleSheet, Text, View} from "react-native";
import FastImage from "react-native-fast-image";
import {Navigation} from "react-native-navigation";

interface props extends _getHome {
    componentId:string
}

const Card = (props:props) => {

    const push = () => {
        Navigation.push(props.componentId,{
            component:{
                name:'com.postid',
                passProps:props,
                options:{
                    statusBar:{
                      visible:true
                    },
                    topBar:{
                        title:{
                            text:props.title
                        }
                    },
                    bottomTabs:{
                        visible:false
                    }
                }
            }
        })
    }

    const image = 'https://cdn.statically.io/img/' + props.image.replace(/^(http|https):\/\//gm,'') + '?h=150&f=auto'
    return (
            <Pressable style={styles.container} onPress={push}>
                <FastImage source={{uri:image,priority:FastImage.priority.normal}} style={styles.image} />
                <View>
                    <Text numberOfLines={1} style={styles.title}>{props.title}</Text>
                    <Text numberOfLines={1} style={styles.label}>{props.chapter}</Text>
                    <Text numberOfLines={1} style={styles.label}>{props.time}</Text>
                </View>
                <View style={styles.header}>
                    <Text style={[styles.title,{ fontSize:11 }]}>{props.type}</Text>
                </View>
            </Pressable>
    )
}

const equalCard = (prev:props,next:props) => {
    return prev.id === next.id && prev.componentId === next.componentId;
    return true;
}

export default React.memo(Card,equalCard)

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
    header:{
        position:'absolute',
        top:0,
        paddingHorizontal:5,
        paddingVertical:2.5,
        borderBottomRightRadius:10,
        backgroundColor:'rgba(0,0,0,.5)'
    }
})
