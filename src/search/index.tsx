import React, {useCallback, useEffect} from 'react'
import {
    Pressable,
    StyleSheet,
    TextInput,
    Keyboard,
    Animated,
} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign'
import {useImmer} from "use-immer";
import {Navigation} from "react-native-navigation";
import {_getSearch} from "../../utils/api";
import CardSearch from "../ui/CardSearch";

interface stateImmer {
    results:_getSearch[]
}

const View = Animated.View;
const FlatList = Animated.FlatList;
const Ant = Animated.createAnimatedComponent(Icon);


const Search = (props:any) => {

    const valueAnimeted = new Animated.Value(0);
    const keyValue = new Animated.Value(0);

    const [state,setState] = useImmer<stateImmer>({
        results:[]
    });

    const keyBoardCall = useCallback(() => {
        const keyShow = Keyboard.addListener('keyboardDidShow',() => {
            Animated.timing(keyValue,{
                useNativeDriver:false,
                toValue:1,
                duration:0
            }).start()
        })
        const keyHide = Keyboard.addListener('keyboardDidHide',() => {
            Animated.timing(keyValue,{
                useNativeDriver:false,
                toValue:0,
                duration:0
            }).start();
        })
        return () => {
            keyHide.remove();
            keyShow.remove();
        }
    },[])

    useEffect(keyBoardCall,[]);

    const renderItem = useCallback(({item}) => {
        return (<CardSearch componentId={props.componentId} {...item} />)
    },[])

    const interpolateColor = keyValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#4b5d67', '#93b5e1']
    })

    const opacityIcon = keyValue.interpolate({
        inputRange:[0,1],
        outputRange:[.3,1]
    })

    const onText = useCallback((text) => {
        _getSearch(text).then((results) => {
            setState(draft => {
                draft.results = results.slice(0,results.length > 10 ? 24 : results.length)
            })
        })
    },[state.results])

    const onSubmitEditing = useCallback(({nativeEvent}) => {
        _getSearch(nativeEvent.text).then((results) => {
            setState(draft => {
                draft.results = results.slice(0,results.length > 10 ? 24 : results.length)
            })
        })
    },[state.results])

    return (
        <View style={{flex:1}}>
            <FlatList
                onScroll={Animated.event([{
                    nativeEvent:{
                        contentOffset:{
                            y:valueAnimeted
                        }
                    }
                }],{useNativeDriver:true})}
                contentContainerStyle={{paddingTop:40}}
                data={state.results || []}
                renderItem={renderItem}
                numColumns={3}
            />
            <View style={[styles.header,{
                opacity:valueAnimeted.interpolate({
                    inputRange:[0,100,700,890],
                    outputRange:[1,0,0,1],
                }),
            }]}>
                <Pressable onPress={() => Navigation.pop(props.componentId)}>
                    <Ant name={'caretleft'} style={{
                        color:interpolateColor,
                        opacity:opacityIcon
                    }} size={20} />
                </Pressable>
                <TextInput
                    onChangeText={onText}
                    onSubmitEditing={onSubmitEditing}
                    style={{flex:1}}
                    placeholder={'search...'}
                    underlineColorAndroid={'transparent'}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header:{
        position:'absolute',
        top:0,
        width:'100%',
        height:40,
        flexDirection:'row',
        backgroundColor:'rgb(255,255,255)',
        borderRadius:7,
        marginHorizontal:2,
        alignItems:'center',
        paddingHorizontal:5,
        borderWidth:1
    }
})

export default Search;