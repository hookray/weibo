import axios from "axios";

import { redis } from "../main";

export default async function loadBirthday(id: string) {
    try {
        const cookie = await redis.get("cookie")
        const cookies = JSON.parse(cookie)
        const u = new URL(cookies.url)
        u.searchParams.set("user_domain", id)
        const { data } = await axios.get(u.href, { headers: cookies.headers })
        if (data && data.header && data.header.data && data.header.data.userInfo && data.header.data.userInfo.birthday) {
            return data.header.data.userInfo.birthday
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}