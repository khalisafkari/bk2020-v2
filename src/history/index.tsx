import React, {useCallback, useEffect} from 'react'
import {Animated, Pressable, RefreshControl, StyleSheet, Text, View} from "react-native";
import {_clearAllHistory, _getAllHistory} from "../../utils/database/HistoryId";
import {useImmer} from "use-immer";
import CardHistory from "../ui/CardHistory";
import Icon from 'react-native-vector-icons/AntDesign'
import Error from "../ui/Error";


interface stateImmer {
    onKeys?:string[]
    error?:boolean
    loading?:boolean
    refreshing?:boolean,
    current:number
    total:number
}


interface props {
    componentId?:string
}

const FlatList  = Animated.FlatList;


const History = (props:props) => {

    const [state,setState] = useImmer<stateImmer>({
        loading:true,
        error:false,
        onKeys:[],
        current:1,
        total:0
    })


    const onCall = useCallback(() => {
       _getAllHistory().then((results) => {
            setState(draft => {
                draft.loading = false;
                draft.onKeys = results.data;
                draft.current = results.currentPage;
                draft.total = results.totalPages;
            })
       }).catch(() => {
            setState(draft => {
                draft.loading = false;
                draft.error = true;
            })
       })
    },[])

    useEffect(onCall,[])

    const clearAll = useCallback(() => {
        _clearAllHistory().then(() => {
            setState(draft => {
                draft.onKeys = []
            })
        }).catch(() => {

        })
    } ,[])

    const renderItem = useCallback(({item}) => {
        return (<CardHistory componentId={props.componentId} keys={item} />)
    },[])

    const keyVirtual = (item) => `virtual-id-${item}`;

    const onRefresh = useCallback(() => {
            setState(draft => {draft.refreshing = true});
            _getAllHistory().then((results) => {
                setState(draft => {
                    draft.refreshing = false;
                    draft.onKeys = results.data;
                    draft.current = results.currentPage;
                    draft.total = results.totalPages;
                })
            }).catch(() => {})
    },[])

    const onEndReachData = useCallback(() => {
        if (state.current < state.total) {
            _getAllHistory(state.current + 1).then((results) => {
                setState(draft => {
                    draft.onKeys = draft.onKeys.concat(results.data);
                    draft.current = draft.current + 1;
                })
            })
        }
    },[state])

    if (state.error) {
        return  ( <Error text={'database lagi fapfap'} />)
    }

    return (
        <View style={{flex:1}}>
            <View style={styles.header}>
                <View style={[styles.removeBtn,{ alignItems:'flex-start' }]}>
                    <Text style={{color:'white',fontSize:20}}>HISTORY</Text>
                </View>
                <View style={styles.removeBtn}>
                    <Pressable style={state => [
                        state.pressed ? {
                            backgroundColor:'rgb(210, 230, 255)'
                        } : {backgroundColor:'transparent'},
                        {
                            padding:5/2,
                            borderRadius:10,
                            alignItems:'center'
                        }
                    ]} onPress={clearAll} >
                        <Icon name={'delete'} color={'white'} size={20} />
                    </Pressable>
                </View>
            </View>
            <FlatList
                refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={onRefresh}  />}
                data={state.onKeys}
                renderItem={renderItem}
                numColumns={3}
                keyExtractor={keyVirtual}
                onEndReachedThreshold={0.1}
                onEndReached={onEndReachData}
                ListEmptyComponent={<Error text={'404'} />}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    header:{
        height:50,
        borderBottomWidth:1,
        borderBottomColor:'rgba(255,255,255,.3)',
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:8,
        alignItems:'center'
    },
    removeBtn:{
        flex:1,
        alignItems:'flex-end'
    }
})

export default History