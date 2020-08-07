import React from "react";
import {ActivityIndicator, View} from "react-native";

export default () => {
    return (
        <View style={{ flex:1,justifyContent:'center',alignItems:'center' }}>
            <ActivityIndicator color={'white'} size={25} />
        </View>
    )
}