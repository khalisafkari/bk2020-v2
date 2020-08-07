import {
    Appodeal, AppodealAdType,
    AppodealConsentRegulation,
    AppodealConsentStatus, AppodealInterstitialEvent, AppodealLogLevel
} from "react-native-appodeal";

const adTypes = AppodealAdType.INTERSTITIAL | AppodealAdType.REWARDED_VIDEO | AppodealAdType.BANNER | AppodealAdType.MREC;

// const initialize = (
//     testing:boolean,
//     callback?:(consent:AppodealConsentStatus,regulation:AppodealConsentRegulation) => void
// ) => {
//     Appodeal.setAge(25);
//     Appodeal.setGender(AppodealGender.MALE);
//     Appodeal.setTesting(testing);
//     Appodeal.setChildDirectedTreatment(false);
//     Appodeal.setOnLoadedTriggerBoth(true);
//     Appodeal.disableLocationPermissionCheck();
//
//     Appodeal.synchroniseConsent('d1bc6b2f68eb021b4d32b5c2d69889d9',(
//         consent:AppodealConsentStatus,
//         regulation:AppodealConsentRegulation
//     ) => {
//         Appodeal.initialize('d1bc6b2f68eb021b4d32b5c2d69889d9', adTypes);
//         callback(consent,regulation);
//     })
// }

const initialize = (
    testing:boolean,
    callback?:(consent: AppodealConsentStatus, regulation: AppodealConsentRegulation) => void
) => {
    Appodeal.setAge(25);
    Appodeal.setTesting(false);
    Appodeal.disableLocationPermissionCheck();
    Appodeal.setChildDirectedTreatment(false);
    Appodeal.setLogLevel(AppodealLogLevel.DEBUG);
    Appodeal.synchroniseConsent('74f2991a011478b2e098d4c7da8979a5eb151b035281f968', (consent: AppodealConsentStatus, regulation: AppodealConsentRegulation)=>{
        Appodeal.initialize('74f2991a011478b2e098d4c7da8979a5eb151b035281f968', adTypes);
    })
    Appodeal.setBannerAnimation(true);
}

const listener = () => {
    Appodeal.addEventListener(AppodealInterstitialEvent.LOADED, (event: any) =>
        console.log("Interstitial loaded. Precache: ", event.isPrecache)
    )
    Appodeal.addEventListener(AppodealInterstitialEvent.SHOWN, () => {
        console.log("Interstitial shown")
    })

    Appodeal.addEventListener(AppodealInterstitialEvent.EXPIRED, () =>
        console.log("Interstitial expired")
    )
    Appodeal.addEventListener(AppodealInterstitialEvent.CLICKED, () =>
        console.log("Interstitial clicked")
    )
    Appodeal.addEventListener(AppodealInterstitialEvent.CLOSED, () =>
        console.log("Interstitial closed")
    )
    Appodeal.addEventListener(AppodealInterstitialEvent.FAILED_TO_LOAD, () =>
        console.log("Interstitial failed to load")
    )
    Appodeal.addEventListener(AppodealInterstitialEvent.FAILED_TO_SHOW, () =>
        console.log("Interstitial failed to show")
    )
}

export default initialize