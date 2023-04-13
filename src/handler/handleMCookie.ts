import { redis } from "../main";

export async function handleMCookie(setCookies: string[]) {
    const headersString = await redis.get("mCookie");
    if (!headersString) {
        return
    }
    const headers = JSON.parse(headersString);
    for (const cookie of setCookies) {
        const setCookie = cookie.split(";")[0]
        const newKey = setCookie.split("=")[0]
        const newValue = setCookie.replace(newKey + "=", "")
        if (newKey === "XSRF-TOKEN") {
            headers['X-XSRF-TOKEN'] = newValue
        }
        const oldCookies = headers['Cookie'].split(";")
        const newCookies = oldCookies.map((oldCookie: string) => {
            const key = oldCookie.split("=")[0]
            if (newKey === key) {
                return key + "=" + newValue
            }
            return oldCookie
        });
        headers['Cookie'] = newCookies.join(";")
    }
    await redis.setex("mCookie", 60 * 10, JSON.stringify(headers))
}