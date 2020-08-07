import React from "react";
import {StyleSheet, View,Text} from "react-native";

const Error = ({ text }) => {
    return (
        <View style={style.error}>
            <Text style={style.errorLabel}>{text}</Text>
        </View>
    )
}

const equal = (prev,next) => {
    return prev.text === next.text;
    return  true;
}

export default React.memo(Error,equal);

const style = StyleSheet.create({
    error:{flex:1,justifyContent:'center',alignItems:'center'},
    errorLabel:{color:'white',fontSize:12,textTransform:'uppercase'}
})