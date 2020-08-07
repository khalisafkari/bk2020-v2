import React, {useCallback, useEffect} from "react";
import {FlatList, View} from "react-native";
import {_getHomeSekte} from "../../utils/sektekomik";
import {useImmer} from "use-immer";
import CardSekteHome from "./Card";

interface states {
    data:_getHomeSekte[]
}

const HomeSekte  = () => {

    const [state,setState] = useImmer<states>({
        data:[]
    });

    const onCall = useCallback(() => {
            _getHomeSekte().then((results) => {
                setState(draft => {
                    draft.data = results;
                })
            })
    },[])

    useEffect(onCall,[])

    const renderItem = useCallback(({item}) => {
        return (
            <CardSekteHome {...item}/>
        )
    },[])

    return (
        <View style={{flex:1}}>
            <FlatList
                data={state.data.length > 5 ? state.data.slice(0,10) : state.data || []}
                renderItem={renderItem}
                numColumns={3}
            />
        </View>
    )
}


export default HomeSekte;