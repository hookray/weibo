import axios from "axios";
import { redis } from "../main";

export default async function loadComments(id: string) {
    try {
        const cookie = await redis.get("mCookie")
        if (!cookie) {
            return []
        }
        const headers = JSON.parse(cookie)
        const { data } = await axios.get(`https://m.weibo.cn/comments/hotflow?id=${id}&mid=${id}&max_id_type=0`, {
            headers
        })
        if (data && data.ok && data.data && data.data.data) {
            return data.data.data
        } else {
            return []
        }
    } catch (error) {
        return []
    }
}