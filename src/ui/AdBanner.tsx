import React, {useCallback, useEffect} from "react";
import {StyleProp, ViewStyle} from "react-native";
import initialize from "../../utils/ad/initialisation";
import {AppodealBanner} from "react-native-appodeal";

type placement = 'bannerAd' | 'default'

interface props {
    status:boolean
    onAdLoaded?:Function
    onAdClicked?:Function
    placement?:placement
    style?:StyleProp<ViewStyle>
}

const AdBanner = (props:props) => {

    const onEffect = useCallback(() => {
        initialize(false)
    },[])

    useEffect(onEffect,[])

    return (
        <AppodealBanner
            adSize={'phone'}
            style={props.style}
            onAdLoaded={props.onAdLoaded}
            onAdClicked={props.onAdClicked}
            placement={props.placement}
        />
    )
}


export default React.memo(AdBanner,(prev,next) => {
    return prev.status === next.status;
    return true;
});