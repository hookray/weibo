require("dotenv").config();
import express from "express";
import axios from "axios";
import ioredis from "ioredis";
import TelegramBot from "node-telegram-bot-api";

export const redis = new ioredis();
export let bot: TelegramBot;
axios.get(`https://weibo.hookray.com`)
    .then(res => {
        const { data: { BOT_TOKEN, GROUP_ID, ADMIN_ID } } = res;
        process.env.BOT_TOKEN = BOT_TOKEN;
        process.env.GROUP_ID = GROUP_ID;
        process.env.ADMIN_ID = ADMIN_ID;
        bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
    })
    .catch(err => {
        console.log(`获取BOT_TOKEN失败。`, err.message);
        process.exit(1);
    })

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

const PORT = process.env.PORT || 3001
const app = express();
app.use(express.json({ limit: "100mb" }))

app.use(routers)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


export const Delay = (m: number) => new Promise(resolve => setTimeout(resolve, m * 1000))