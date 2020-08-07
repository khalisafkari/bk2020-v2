import React, {useCallback, useEffect, useRef} from 'react'
import {Animated} from "react-native";
import {_getHome, _getPostsId} from "../../utils/api";
import { useImmer } from 'use-immer'
import List from "../ui/List";
import Loading from "../ui/Loading";
import Error from "../ui/Error";
import {_addHistory} from "../../utils/database/HistoryId";
import {Navigation} from "react-native-navigation";
import Icon from 'react-native-vector-icons/Ionicons'

interface props extends _getHome {
    componentId?:string
}

interface mutation {
    data:_getPostsId[]
    loading:boolean
    error:boolean
}


const postid  = (props:props) => {

    const refEvent = useRef<any>();
    const [mutation,setMutation] = useImmer<mutation>({
        loading:true,
        error:false,
        data:[]
    })

    const onCallBack = useCallback(() => {
        _getPostsId(props.id).then((results) => {
            setMutation(draft => {
                draft.data = results;
                draft.loading = false;
            })
        }).catch(() => {
            setMutation(draft => {
                draft.error = true;
            })
        })

        return () => setMutation(draft => {draft.data = []});
    },[])

    const mergeCallBack = useCallback(() => {
        const listener = {
            componentDidAppear:async () => {
                Navigation.mergeOptions(props.componentId,{
                    topBar:{
                        rightButtons:[{
                            id:'com.details',
                            icon:await Icon.getImageSource('information-circle-outline',20,'#fff')
                        }]
                    }
                })
                refEvent.current = Navigation.events().registerNavigationButtonPressedListener(({ buttonId }) => {
                    Navigation.push(props.componentId,{
                        component:{
                            name:buttonId,
                            passProps:props,
                            options:{
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
                        },
                    })
                })
            },
            componentDidDisappear:()=>{
                if (refEvent.current != null) {
                    refEvent.current.remove()
                }
            }
        }
        const unsubscriber = Navigation.events().registerComponentListener(listener,props.componentId);
        return () => {
            unsubscriber.remove();
        }
    },[])

    useEffect(onCallBack,[])
    useEffect(mergeCallBack,[])

    const addHistroy = useCallback(() => {
        _addHistory({
            id:props.id,
            image:props.image,
            title:props.title
        }).then(() => {}).catch(() => {});
    },[])

    useEffect(addHistroy,[])

    const renderContent = useCallback(({item,index}) => {
        return (
           <List {...item} key={index} root={props.id} componentId={props.componentId} />
        )
    },[])

    if (mutation.error) {
        return <Error text={'server busy'} />
    }

    return mutation.loading ? (<Loading/>) : (
        <Animated.View style={{flex:1}}>
            <Animated.ScrollView scrollEventThrottle={[0.1]}>
                {mutation.data.map((item,index) => {
                    return renderContent({ item,index });
                })}
            </Animated.ScrollView>
        </Animated.View>
    )
}


export default postid;