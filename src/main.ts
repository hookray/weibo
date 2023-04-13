require("dotenv").config();
import express from "express";
import ioredis from "ioredis";
import TelegramBot from "node-telegram-bot-api";

export const redis = new ioredis();
export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/id/, async msg => {
    await bot.sendMessage(msg.chat.id, `当前聊天窗口ID:\`${msg.chat.id}\`\n发送消息用户ID:\`${msg.from.id}\``, { parse_mode: "MarkdownV2" })
})
bot.onText(/\/cleanCookie/, async msg => {

    const { from: { id: fromID }, chat: { id: chatID } } = msg
    if (chatID.toString() !== process.env.GROUP_ID || fromID.toString() !== process.env.ADMIN_ID) {
        return bot.sendMessage(chatID, `滚～`)
    }
    await redis.del("mCookie", "cookie")

    bot.sendMessage(chatID, `Cookie清理成功。`)
})

import routers from "./router";

const app = express();
app.use(express.json({ limit: "100mb" }))

app.use(routers)

app.listen(3380, () => {
    console.log("Server is running on port 3380");
})


export const Delay = (m: number) => new Promise(resolve => setTimeout(resolve, m * 1000))