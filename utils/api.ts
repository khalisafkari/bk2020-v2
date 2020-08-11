import axios from "axios";
import cheerio from "cheerio";

const manga = axios.create({ baseURL:'https://westmanga.info',headers:{ Referer:'com.bk2020.production' },timeout:1000});

export interface _getHome {
    id:string
    image?:string
    title?:string
    sinopsis?:string
    score?:string
    type?:string
    time?:string
    chapter?:string
}

export interface _getPostsId {
    id:string
    title:string
    download:string
    time:string
}

interface _getSearchGenre {
    id:string
    title:string
}

export interface _getSearch {
    id:string
    title:string
    image?:string
    genre?:_getSearchGenre[]
}

export interface _getDetails {
    japan:string
    total:any
    status:string
    author:string
    genre:Array<{
        id:string
        title:string
    }>
    rating:string
    release_data:string
    last:string
    sinopsis:string
}

export const _getHome = async (page?:number):Promise<_getHome[]> => {
    try {
        const schema:string = `/${page > 1 ? `page/${page}` : ''}`;
        const url = await manga.get(schema);
        const $ = cheerio.load(url.data);
        const data:_getHome[] = $('.items .item').map((index,element) => ({
            id:$(element).find('a').attr('href'),
            image:$(element).find('img').attr('src'),
            title:$(element).find('.boxinfo span[class="tt"]').text(),
            sinopsis:$(element).find('.boxinfo span[class="ttx"] p').text(),
            score:$(element).find('.cocs.imdb_r span[class="dato"] b').eq(0).text(),
            type:$(element).find('.typepost').text(),
            time:$(element).find('.fixyear .imdb').text(),
            chapter:$(element).find('.fixyear .year').text()
        })).get();
        return data;
    } catch (e) {
        throw new Error("Thrown from thisThrows()");
    }
}

export const _getPostsId = async (id:string):Promise<_getPostsId[]> => {
    try {
        const schema = id;
        const url = await manga.get(schema);
        const $ = cheerio.load(url.data);
        const list:_getPostsId[] = $('.cl ul li').map((index,element) => ({
            id:$(element).find('.leftoff a').attr('href'),
            title:$(element).find('.leftoff a').text(),
            download:$(element).find('.rightoffdl a').attr('href'),
            time:$(element).find('.rightoff').text()
        })).get();
        return list;
    } catch (e) {
        throw new Error("Thrown from thisThrows()");
    }
}

export const _getImageContent = async (id:string) => {
    try {
        const url = await manga.get(id)
        const $ = cheerio.load(url.data);
        const list = $('#readerarea img').map((index,elemeent) => `<img alt="${index}" src="${$(elemeent).attr('src')}"/>`).get();
        //const list = $('#readerarea p a').map((index,element) => `<img alt="" src="${$(element).attr('href')}"/>` ).get();
        const prev = $('.nextprev a[rel="prev"]').eq(0).attr('href')
        const next = $('.nextprev a[rel="next"]').eq(1).attr('href')
        return {
            content:list,
            prev:prev ? prev : null,
            next:next ? next : null
        }
    } catch (e) {
        throw new Error('error');
    }
}

export const _getSearch = async (text:string):Promise<_getSearch[]> => {
    try {
        const schame = `/?s=${text}&post_type=manga`;
        const url = await manga.get(schame);
        const $ = cheerio.load(url.data);
        const list:_getSearch[] = $('.result-search').map((index,element) => ({
            id:$(element).find('.kanan_search header span a').attr('href'),
            title:$(element).find('.kanan_search header span a').text().trim(),
            image:$(element).find('.fletch img').attr('src'),
            genre:$(element).find('.kanan_search .tipu_search a').map((indexGenre,elementGenre) => ({
                id:$(elementGenre).attr('href'),
                title:$(elementGenre).text().trim()
            })).get()
        })).get();
        return list;
    } catch (e) {
        throw new Error('error');
    }
};

export const _getDetails = async (id:string):Promise<_getDetails> => {
    try {
        const schame  = id;
        const url = await manga.get(schame);
        const $ = cheerio.load(url.data);
        const total = await _getPostsId(id);
        const data:_getDetails = {
            japan:$('div.area .mangainfo .topinfo div table tbody tr').eq(1).find('td').text().trim(),
            total:$('div.area .mangainfo .topinfo div table tbody tr').eq(2).find('td').text().trim() ? $('div.area .mangainfo .topinfo div table tbody tr').eq(2).find('td').text().trim() : total.length,
            status:$('div.area .mangainfo .topinfo div table tbody tr').eq(3).find('td').text().trim(),
            author:$('div.area .mangainfo .topinfo div table tbody tr').eq(4).find('td').text().trim(),
            genre:$('div.area .mangainfo .topinfo div table tbody tr').eq(5).find('td a').map((index,element) => ({
                id:$(element).attr('href'),
                title:$(element).text().trim()
            })).get(),
            rating:$('div.area .mangainfo .topinfo div table tbody tr').eq(6).find('td').text().trim(),
            release_data:$('div.area .mangainfo .topinfo div table tbody tr').eq(7).find('td').text().trim() ? $('div.area .mangainfo .topinfo div table tbody tr').eq(7).find('td').text().trim() : total[0].time,
            last:$('div.area .mangainfo .topinfo div table tbody tr').eq(8).find('td').text().trim() ? $('div.area .mangainfo .topinfo div table tbody tr').eq(8).find('td').text().trim() : total[0].title,
            sinopsis:$('div.area .mangainfo .sin p').text().trim(),
        }
        return data;
    } catch (e) {
        throw new Error('error');
    }
};

export const _getList = async (page?:number):Promise<_getSearch[]> => {
    try {
        const schema = `/manga-list/${page > 1 ? `page/${page}` : ''}`;
        const url = await manga.get(schema);
        const $ = cheerio.load(url.data);
        const data:_getSearch[] = $('.result-search').map((index,element) => ({
            id:$(element).find('.kanan_search header span a').attr('href'),
            title:$(element).find('.kanan_search header span a').text().trim(),
            image:$(element).find('.fletch img').attr('src'),
            genre:$(element).find('.kanan_search .tipu_search a').map((indexGenre,elementGenre) => ({
                id:$(elementGenre).attr('href'),
                title:$(elementGenre).text().trim()
            })).get()
        })).get();
        return data;
    } catch (e) {
        throw  new Error('error');
    }
}

export const _getPaginado = async (uri?:string):Promise<number> => {
    try {
        const schema = uri ? uri : 'https://westmanga.info/manga-list/';
        const url = await manga.get(schema);
        const $ = cheerio.load(url.data);
        return Number($('.paginado ul li').eq(-1).find('a').attr('href').replace(/\D+/gi,'').trim())
    } catch (e) {
        throw  new Error('error');
    }
};

export const _getGenreSource = async (uri?:string):Promise<_getSearch[]> => {
    try {
        const schema =  uri;
        const url = await manga.get(schema);
        const $ = cheerio.load(url.data);
        const data:_getSearch[] = $('.result-search').map((index,element) => ({
            id:$(element).find('.kanan_search header span a').attr('href'),
            title:$(element).find('.kanan_search header span a').text().trim(),
            image:$(element).find('.fletch img').attr('src'),
            genre:$(element).find('.kanan_search .tipu_search a').map((indexGenre,elementGenre) => ({
                id:$(elementGenre).attr('href'),
                title:$(elementGenre).text().trim()
            })).get()
        })).get();
        return data;
    } catch (e) {
        throw  new Error('error');
    }
}

export const _getGenre = async ():Promise<Array<{
    id:string
    title:string
}>> => {
    try {
        const schema = '/manga-list/';
        const url = await manga.get(schema);
        const $ = cheerio.load(url.data);
        const data:Array<{
            id:string
            title:string
        }> = $('.genres li').map((index,element) => ({
            id:$(element).find('a').attr('href'),
            title:$(element).find('a').text().trim()
        })).get();
        return data;
    } catch (e) {
        throw  new Error('error');
    }
}