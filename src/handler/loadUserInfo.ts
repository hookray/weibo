import axios from "axios";

import { redis } from "../main";
import { handleMCookie } from "./handleMCookie";
import handleCookieExpire from "./handleCookieExpire";

export default async function loadUserInfo(id: string) {
    try {
        const cookie = await redis.get("mCookie")
        if (!cookie) {
            console.log(`M站Cookie失效`);
            handleCookieExpire("M")
            return null
        }
        const headers = JSON.parse(cookie)
        const { data, headers: ResponseHeaders } = await axios.get(`https://m.weibo.cn/profile/info?uid=${id}`, {
            headers
        })
        if (data && data.ok && data.data && data.data.more) {
            if (ResponseHeaders['set-cookie']) {
                await handleMCookie(ResponseHeaders['set-cookie'])
            }
            return data.data
        } else {
            return null
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(`【Error】loadUserInfo:`, error.response?.data)
        } else {
            console.log(`【Error】loadUserInfo:`, error.message)
        }
        return null
    }
}