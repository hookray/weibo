import { bot } from "../main";

export default async function handleCookieExpire(type: "M" | "Client") {
    await bot.sendMessage(process.env.GROUP_ID, type === "M" ? "M站Cookie失效,请及时更新。" : "客户端Cookie失效,请及时更新。")
}