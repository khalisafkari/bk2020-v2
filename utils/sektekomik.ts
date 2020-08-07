import axios from "axios";
import cheerio from "cheerio";

const limitPage:number = 30;
const sekte = axios.create({ baseURL:'https://sektekomik.com',headers:{ Referer:'https://sektekomik.com/' },timeout:1000});

export interface _getHomeSekte {
    id?:string
    title?:string
    image?:string
    chapter?:string
    time?:string
}

export const _getHomeSekte = async (page?:number):Promise<_getHomeSekte[]> => {
    try {
        const schema = `${page < limitPage ? `/?page=${page}` : '/'}`
        const url = await sekte.get(schema);
        const $ = cheerio.load(url.data);
        const data:_getHomeSekte[] = $('.bixbox').eq(-1).find('.listupd .utao').map((index,element) => ({
            id:$(element).find('.imgu a').attr('href'),
            title:$(element).find('.imgu a').attr('title'),
            image:$(element).find('.imgu a img').attr('src'),
            chapter:$(element).find('.luf ul li').eq(0).find('a').text().trim(),
            time:$(element).find('.luf ul li').eq(0).find('span').text().trim()
        })).get();
        return data;
    } catch (e) {
        throw new Error("Neworking failed");
    }
}