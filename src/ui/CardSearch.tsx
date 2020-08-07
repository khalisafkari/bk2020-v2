import React, {useCallback} from 'react'
import {Pressable, StyleSheet, Text, View} from "react-native";
import {_getSearch} from "../../utils/api";
import FastImage from "react-native-fast-image";
import {Navigation} from "react-native-navigation";

interface props extends _getSearch {
    componentId?:string
}

const CardSearch = (props:props) => {

    const onPress = useCallback(() => {
        Navigation.push(props.componentId,{
            component:{
                name:'com.postid',
                passProps:{
                    id:props.id,
                    title:props.title,
                    image:props.image
                },
                options:{
                    statusBar:{
                        visible:true
                    },
                    topBar:{
                        visible:true,
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
    },[])

    const image = 'https://cdn.statically.io/img/' + props.image.replace(/^(http|https):\/\//gm,'') + '?h=140&f=auto'
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <FastImage source={{uri:image,priority:FastImage.priority.normal}} style={styles.image} />
            <View>
                <Text numberOfLines={1} style={styles.title}>{props.title}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container:{
        // width:(Dimensions.get('window').width / 3) * 0.90,
        flex:1/3,
        margin:5,
        height:160
    },
    image:{
        height:140,
        width:'100%'
    },
    title:{
        color:'#fff'
    }
})

const eqCardSearch = (prev:_getSearch,next:_getSearch) => {
    return prev.id === next.id;
    return true;
}

export default React.memo(CardSearch,eqCardSearch)