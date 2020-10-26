import React, {useCallback, useEffect, useRef} from 'react';
import {
  useWindowDimensions,
  View,
  Animated,
  StyleSheet,
  Pressable,
  Text,
  Alert,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useImmer} from 'use-immer';
import {_getImageContent} from '../../utils/api';
import html from './html';
import Loading from '../ui/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import {Navigation} from 'react-native-navigation';
import {BannerAd} from 'react-native-smaato-ad';
import {
  _setHistoryId,
  _updateHistoryId,
  _adShow,
  _adShowChapter,
} from '../../utils/database/HistoryId';
import SKX from 'react-native-sdkx'

interface props {
  root: string;
  id: string;
  time: string;
  title: string;
  componentId: string;
}

interface istate {
  id: string;
  html?: string;
  next?: string | null;
  prev?: string | null;
}

const OnView = (props: props) => {
  const {height} = useWindowDimensions();
  const webRef = useRef<any>();
  const topBotAnimated = useRef<Animated.Value>(new Animated.Value(0)).current;
  const [state, setState] = useImmer<istate>({
    id: props.id,
    html: '',
    prev: '',
    next: '',
  });

  const onFetch = useCallback(() => {
    _getImageContent(state.id)
      .then((results) => {
        setState((draft) => {
          draft.id = state.id;
          draft.html = html(results.content);
          draft.prev = results.prev;
          draft.next = results.next;
        });
        _updateHistoryId(
          props.root,
          props.id,
          'Chapter ' + props.id.match(/(\d+)/g).toString().replace(',', '-'),
        );
      })
      .catch(() => {
        Alert.alert('Error', 'Network Failed');
      });
  }, []);

  const lifeCycle = useCallback(() => {
    const listener = {
      componentDidAppear: () => {
      },
      componentDidDisappear: () => {
        _adShow();
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(
      listener,
      props.componentId,
    );
    return () => {
      unsubscribe.remove();
    };
  }, []);

  useEffect(onFetch, []);
  useEffect(lifeCycle, []);

  const onScrollEvent = useCallback(({nativeEvent}) => {
    const size: any =
      typeof (nativeEvent.contentSize.height - height) === 'number' &&
      (nativeEvent.contentSize.height - height).toFixed();
    const position: any =
      typeof nativeEvent.contentOffset.y === 'number' &&
      nativeEvent.contentOffset.y.toFixed();

    if (position > 100) {
      if (position + 500 > size) {
        Animated.timing(topBotAnimated, {
          duration: 1000,
          toValue: 0,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(topBotAnimated, {
          duration: 1000,
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
    } else {
      Animated.timing(topBotAnimated, {
        duration: 1000,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, []);
  const onMessageEvent = useCallback(({nativeEvent}) => {
    if (nativeEvent.data) {
      Animated.timing(topBotAnimated, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, []);
  const onPrev = useCallback(() => {
    _adShowChapter();
    if (state.prev && state.html) {
      setState((draft) => {
        draft.html = '';
      });
      _getImageContent(state.prev)
        .then((results) => {
          setState((draft) => {
            draft.id = state.prev;
            draft.html = html(results.content);
            draft.next = results.next;
            draft.prev = results.prev;
          });
          _setHistoryId(state.prev);
          _updateHistoryId(
            props.root,
            state.prev,
            'Chapter ' +
              state.prev.match(/(\d+)/g).toString().replace(',', '-'),
          );
        })
        .catch(() => {
          Alert.alert('Error', 'Network Failed');
        });
    }
  }, [state]);
  const onNext = useCallback(() => {
    _adShowChapter();
    if (state.next !== null && state.html) {
      setState((draft) => {
        draft.html = '';
      });
      _getImageContent(state.next)
        .then((results) => {
          setState((draft) => {
            draft.id = state.next;
            draft.html = html(results.content);
            draft.next = results.next;
            draft.prev = results.prev;
          });
          _setHistoryId(state.next);
          _updateHistoryId(
            props.root,
            state.next,
            'Chapter ' +
              state.next.match(/(\d+)/g).toString().replace(',', '-'),
          );
        })
        .catch(() => {
          Alert.alert('Error', 'Network Failed');
        });
    }
  }, [state]);

  const onBack = useCallback(() => {
    Navigation.pop(props.componentId);
  }, []);

  return (
    <React.Fragment>
      <View style={{height, backgroundColor: 'rgba(255,255,255,.2)'}}>
        {state.html ? (
          <WebView
            ref={webRef}
            onScroll={onScrollEvent}
            androidLayerType={'hardware'}
            contentMode={'recommended'}
            source={{html: state.html}}
            bounces={false}
            automaticallyAdjustContentInsets={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onMessage={onMessageEvent}
          />
        ) : (
          <Loading />
        )}
      </View>
      <Animated.View
        style={[
          styles.Header,
          {
            transform: [
              {
                translateY: topBotAnimated.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -50],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}>
        <Pressable
          onPress={onBack}
          style={(press) => [
            {borderRadius: 5, paddingHorizontal: 5},
            press.pressed
              ? {backgroundColor: 'rgba(255,255,255,.35)'}
              : {backgroundColor: 'transparent'},
            styles.btnTopBot,
          ]}>
          <Icon name={'ios-arrow-back-sharp'} color={'white'} size={25} />
          <Text style={{color: 'white', fontSize: 12, fontWeight: '600'}}>
            {'EPISODE ' + state.id.match(/(\d+)/g).toString().replace(',', '-')}
          </Text>
        </Pressable>
      </Animated.View>
      <Animated.View
        style={[
          styles.Footer,
          {
            transform: [
              {
                translateY: topBotAnimated.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 50],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}>
        <Pressable
          onPress={onPrev}
          style={(press) => [
            {borderRadius: 5, paddingHorizontal: 5},
            press.pressed
              ? {backgroundColor: 'rgba(255,255,255,.35)'}
              : {backgroundColor: 'transparent'},
            styles.btnTopBot,
          ]}>
          <Icon
            name={'ios-arrow-back-sharp'}
            color={state.prev ? 'white' : 'rgba(255,255,255,.35)'}
            size={25}
          />
          <Text
            style={{
              color: state.prev ? 'white' : 'rgba(255,255,255,.35)',
              fontSize: 12,
              fontWeight: '800',
            }}>
            PREV
          </Text>
        </Pressable>
        <Pressable
          style={(press) => [
            {borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10},
            press.pressed
              ? {backgroundColor: 'rgba(255,255,255,.35)'}
              : {backgroundColor: 'transparent'},
            styles.btnTopBot,
          ]}>
          <Icon name={'chatbox-ellipses-outline'} color={'white'} size={20} />
        </Pressable>
        <Pressable
          onPress={onNext}
          style={(press) => [
            {borderRadius: 5, paddingHorizontal: 5},
            press.pressed
              ? {backgroundColor: 'rgba(255,255,255,.35)'}
              : {backgroundColor: 'transparent'},
            styles.btnTopBot,
          ]}>
          <Text
            style={{
              color: state.next ? 'white' : 'rgba(255,255,255,.35)',
              fontSize: 12,
              fontWeight: '800',
            }}>
            NEXT
          </Text>
          <Icon
            name={'ios-arrow-forward-sharp'}
            color={state.next ? 'white' : 'rgba(255,255,255,.35)'}
            size={25}
          />
        </Pressable>
      </Animated.View>
      <Animated.View
        style={[
          styles.AdFooter,
          {
            transform: [
              {
                translateY: topBotAnimated.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 50],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}>
        <BannerAd
          style={[styles.Ad]}
          adID={'130897362'}
          bannerAdSize={'XX_LARGE_320x50'}
          adReload={'NORMAL'}
        />
      </Animated.View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  Header: {
    position: 'absolute',
    height: 50,
    top: 0,
    width: '100%',
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  btnTopBot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  Footer: {
    position: 'absolute',
    height: 50,
    bottom: 0,
    width: '100%',
    backgroundColor: 'black',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  Ad: {
    height: 50,
    width: 320,
  },
  AdFooter: {
    position: 'absolute',
    height: 50,
    bottom: 48,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default OnView;

// import React, {useCallback, useLayoutEffect, useRef} from "react";
// import {
//     Animated,
//     NativeScrollEvent,
//     Pressable,
//     SafeAreaView,
//     StyleSheet,
//     Text,
//     useWindowDimensions
// } from "react-native";
// import {WebView as Web, WebViewMessageEvent} from "react-native-webview";
// import {useImmer} from "use-immer";
// import {_getImageContent} from "../../utils/api";
// import html from "./html";
// import Icon from 'react-native-vector-icons/Ionicons'
// import {Navigation} from "react-native-navigation";
// import { BannerAd as AdLayout } from 'react-native-smaato-ad';
// import {_setHistoryId, _updateHistoryId} from "../../utils/database/HistoryId";
//
// const View = Animated.View;
// const WebView = Animated.createAnimatedComponent(Web);
// const BannerAd = Animated.createAnimatedComponent(AdLayout);
//
// interface state {
//     id:string
//     size:number
//     html:string
//     title:string
//     next?:string | null
//     prev?:string | null
// }
//
// interface scrollEvent {
//     nativeEvent:NativeScrollEvent
// }
//
// const onView = (props:any) => {
//
//     const webviewRef = useRef<any | null>(null);
//     const { height } = useWindowDimensions();
//     const value = useRef<Animated.Value>(new Animated.Value(0)).current;
//
//     const [state,setState] = useImmer<state>({
//         id:'',
//         size:0,
//         html:'',
//         title:'',
//         next:null,
//         prev:null
//     })
//
//     const onLoaded = useCallback(() => {
//         _getImageContent(props.id).then((result) => {
//             setState(draft => {
//                 draft.id = props.id;
//                 draft.html = html(result.content);
//                 draft.title = 'Chapter ' + props.id.match(/(\d+)/g).toString().replace(',','-');
//                 draft.next = result.next;
//                 draft.prev = result.prev;
//             });
//             _updateHistoryId(
//                 props.root,
//                 props.id,
//                 'Chapter ' + props.id.match(/(\d+)/g).toString().replace(',','-'));
//         }).catch(() => {
//
//         })
//         return () => {}
//     },[])
//
//     useLayoutEffect(onLoaded,[])
//
//
//     // @ts-ignore
//     const onScrollEvent = useCallback(({nativeEvent}:scrollEvent) => {
//         const totalHeight:number = nativeEvent.contentSize.height - height;
//         const scrollHeight:number = nativeEvent.contentOffset.y;
//         if (scrollHeight < 100) {
//             Animated.timing(value, {
//                 useNativeDriver: true,
//                 duration: 1000,
//                 toValue: 0
//             }).start();
//         } else if (totalHeight.toFixed() === scrollHeight.toFixed()) {
//             Animated.timing(value,{
//                 useNativeDriver:true,
//                 toValue:0,
//                 duration:1000
//             }).start()
//         } else {
//             Animated.timing(value,{
//                 useNativeDriver:true,
//                 duration:1000,
//                 toValue:100
//             }).start();
//         }
//     },[])
//
//     const webViewMessage = useCallback((event:WebViewMessageEvent) => {
//         if (event.nativeEvent.data === "up") {
//             Animated.timing(value,{
//                 duration:1000,
//                 toValue:0,
//                 useNativeDriver:true
//             }).start();
//         }
//     },[])
//
//     const transformBottom = [{
//         translateY:value.interpolate({
//             inputRange:[0,100],
//             outputRange:[0,100],
//             extrapolate:'clamp'
//         })
//     }]
//
//     const transformTop = [{
//         translateY:value.interpolate({
//             inputRange:[0,100],
//             outputRange:[0,-100],
//             extrapolate:'clamp'
//         })
//     }]
//
//     const onPressNext = useCallback(() => {
//         _getImageContent(state.next).then((result) => {
//             setState(draft => {
//                 draft.id = state.next;
//                 draft.html = html(result.content);
//                 draft.title = 'Chapter ' + state.next.match(/(\d+)/g).toString().replace(',','-');
//                 draft.next = result.next;
//                 draft.prev = result.prev;
//             })
//             webviewRef.current.injectJavaScript('document.documentElement.scrollTop = 0');
//             _setHistoryId(state.next);
//             _updateHistoryId(
//                 props.root,
//                 state.next,
//                 'Chapter ' + state.next.match(/(\d+)/g).toString().replace(',','-'));
//         }).catch((error) => {
//
//         })
//     },[state.next])
//
//     const onPressPrev = useCallback(() => {
//         _getImageContent(state.prev).then((result) => {
//             setState(draft => {
//                 draft.id = state.prev;
//                 draft.html = html(result.content);
//                 draft.title = 'Chapter ' + state.prev.match(/(\d+)/g).toString().replace(',','-');
//                 draft.next = result.next;
//                 draft.prev = result.prev;
//             })
//             webviewRef.current.injectJavaScript('document.documentElement.scrollTop = 0');
//             _setHistoryId(state.prev);
//             _updateHistoryId(
//                 props.root,
//                 state.prev,
//                 'Chapter ' + state.prev.match(/(\d+)/g).toString().replace(',','-'));
//
//         }).catch((error) => {
//
//         })
//     },[state.prev])
//
//
//     return (
//         <SafeAreaView style={{flex:1}}>
//         <View style={{ height,width:'100%' }}>
//             <WebView
//                 ref={webviewRef}
//                 source={{html:state.html}}
//                 automaticallyAdjustContentInsets={false}
//                 startInLoadingState={true}
//                 // @ts-ignore
//                 onScroll={onScrollEvent}
//                 showsVerticalScrollIndicator={false}
//                 onMessage={webViewMessage}
//             />
//             <View style={[styles.bottom,{transform:transformBottom }]}>
//                 <Pressable onPress={onPressPrev} disabled={state.prev ? false : true} style={[styles.btn,{ justifyContent:'flex-start' }]}>
//                     <Icon name={'ios-arrow-back-sharp'} color={'white'} size={20} />
//                     <Text style={styles.label}>Sebelumnya</Text>
//                 </Pressable>
//                 <Pressable style={{flex:1,alignItems:'center',justifyContent:'center'}} >
//                     <Icon name={'chatbox-ellipses-outline'} color={'white'} size={25} />
//                 </Pressable>
//                 <Pressable onPress={onPressNext} disabled={state.next ? false : true} style={[styles.btn,{ justifyContent:'flex-end' }]}>
//                     <Text style={styles.label}>Selanjutnya</Text>
//                     <Icon name={'ios-arrow-forward-sharp'} color={'white'} size={20} />
//                 </Pressable>
//             </View>
//             <View style={[styles.ad,{
//                 transform:[{translateY:value.interpolate({inputRange:[0,100], outputRange:[0,45], extrapolate:'clamp'})}]
//             }]}>
//                 <BannerAd style={{ height:50,width:320 }}
//                           adID={'130897362'}
//                           bannerAdSize={'XX_LARGE_320x50'}
//                           adReload={'VERY_SHORT'}/>
//             </View>
//             <View style={[styles.top,{transform:transformTop}]}>
//                 <Pressable style={{ flex:1,flexDirection:'row',alignItems:'center' }} onPress={() => Navigation.pop(props.componentId)}>
//                     <Icon name={'ios-arrow-back-sharp'} color={'white'} size={20} />
//                     <Text numberOfLines={1} style={{color:'white',marginHorizontal:8}}>{state.title}</Text>
//                 </Pressable>
//             </View>
//         </View>
//         </SafeAreaView>
//     )
// }
//
// const styles = StyleSheet.create({
//     top:{
//         position:'absolute',
//         top:0,
//         width:'100%',
//         height:50,
//         backgroundColor:'black',
//         flexDirection:'row',
//         justifyContent:'space-between',
//         alignItems:'center',
//         paddingHorizontal:8
//     },
//     bottom:{
//         position:'absolute',
//         bottom:45 / 2,
//         width:'100%',
//         height:45,
//         backgroundColor:'black',
//         flexDirection:'row',
//         justifyContent:'space-between',
//         alignItems:'center',
//         paddingHorizontal:5,
//     },
//     btn:{
//         flex:1,
//         flexDirection:'row',
//         alignItems:'center'
//     },
//     label:{
//         fontSize:10,
//         color:'white',
//         textTransform:'uppercase'
//     },
//     ad:{
//         position:'absolute',
//         bottom:45 + (45 / 2) - 2,
//         height:50,
//         width:'100%',
//         backgroundColor:'transparent'
//     }
// })
//
// export default onView;
