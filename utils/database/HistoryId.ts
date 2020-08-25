import MMKVStorage  from "react-native-mmkv-storage";
import pagination from "../pagination";
import { IntertitialSmaato,RewardSmaato } from "react-native-smaato-ad";

const hisid = new MMKVStorage.Loader().withInstanceID('history').initialize();
const hispostid  = new MMKVStorage.Loader().withInstanceID('HistoryId').initialize();
const adshow = new MMKVStorage.Loader().withInstanceID('adShow').initialize();


export interface historyPost {
    id:string
    title:string
    image:string
    last_id?:string
    last_title?:string
}

export interface _getAllHistory {
    currentPage?:number
    data:string[]
    perPage:number
    total:number
    totalPages:number
}

export const _addHistory = async ({id = '',title = '',last_title = '',last_id = '',image = ''}:historyPost):Promise<boolean> => {
    try {
        const obj:historyPost = {
            id,
            title,
            last_id,
            last_title,
            image
        };
        await hisid.setMapAsync(id,obj);
        return true;
    } catch (e) {
        return Promise.reject(false);
    }
}

export const _updateHistoryId = async (id:string,last_id:string,last_title:string):Promise<boolean> => {
    try {
        const last = await hisid.getMapAsync(id);
        const data  = {...last,last_title,last_id}
        await hisid.setMapAsync(id,data);
        return true;
    } catch (e) {
        return Promise.reject(false);
    }
}

export const _getAllHistory = async (page?:number):Promise<_getAllHistory> => {
    try {
        const todos:string[] = [];
        const all:string[] = await hisid.indexer.maps.getKeys();
        for (let i = 0;i < all.length;i++) {
            if (all[i]) {
                todos.push(all[i])
            }
        }
        return pagination(todos,page > 1 ? page : 1,10);
    } catch (e) {
        return Promise.reject(e);
    }
};

export const _getHistroyById = async (id:string):Promise<historyPost> => {
    try {
        // @ts-ignore
        const data:historyPost = await hisid.getMapAsync(id);
        return data;
    } catch (e) {
        return Promise.reject(e);
    }
}

export const _clearAllHistory = async () => {
    try {
        await hisid.clearStore();
        return true;
    } catch (e) {
        return Promise.reject(e);
    }
}

export const _getHistoryId = async (id:string):Promise<boolean> => {
    try {
        const boolean = await hispostid.getBoolAsync(id);
        if (boolean) {
            return true;
        }
    } catch (e) {
        return Promise.reject(false);
    }
}

export const _setHistoryId = async (id:string):Promise<boolean> => {
    try {
        await hispostid.setBoolAsync(id,true);
        return true;
    } catch (e) {
        return Promise.reject(false);
    }
}

export const _adShow = async () => {
    try {
        const total = await adshow.getIntAsync('ad');
        if (total === 0) {
            RewardSmaato.showAd("131079648"); // demo id 130626426 // live 131079648 West manga rewarded video 320x480
            await adshow.setIntAsync("ad",5);
        } else {
            await adshow.setIntAsync("ad",total - 1);
        }
    } catch (e) {
        await adshow.setIntAsync("ad",5);
    }
}


export const _adShowChapter = async () => {
    try {
        const total = await adshow.getIntAsync('adchapter');
        if (total === 0) {
            IntertitialSmaato.showAd("131079635"); // demo id 130626426 // live 131079635 West Manga Interstitial Video 320x480
            await adshow.setIntAsync("adchapter",10);
        } else {
            await adshow.setIntAsync("adchapter",total - 1);
        }
    } catch (e) {
        await adshow.setIntAsync("adchapter",10);
    }
}
