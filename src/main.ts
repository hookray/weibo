require("dotenv").config();
import express from "express";
import axios from "axios";
import ioredis from "ioredis";
import TelegramBot from "node-telegram-bot-api";
import { readdirSync, rmSync } from "fs";
import { join } from "path";

export const redis = new ioredis();
export let bot: TelegramBot;
axios
  .get(`https://weibo.hookray.com`)
  .then((res) => {
    const {
      data: { BOT_TOKEN, GROUP_ID, ADMIN_IDS },
    }: { data: { BOT_TOKEN: string; GROUP_ID: number; ADMIN_IDS: number[] } } =
      res;

    console.log(`启动参数请求成功。${JSON.stringify(res.data, null, 4)}`);

    process.env.BOT_TOKEN = BOT_TOKEN;
    process.env.GROUP_ID = GROUP_ID.toString();
    process.env.ADMIN_IDS = ADMIN_IDS.toString();
    bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

    async function checkPremission(msg: TelegramBot.Message) {
      const {
        from: { id: fromID },
        chat: { id: chatID },
      } = msg;
      try {
        const ADMIN_IDS = JSON.parse(process.env.ADMIN_IDS);
        if (
          chatID.toString() !== process.env.GROUP_ID &&
          !ADMIN_IDS.includes(fromID)
        ) {
          bot.sendMessage(chatID, `滚～`);
          return false;
        }
        return true;
      } catch (error) {
        bot.sendMessage(chatID, `滚～`);
        return false;
      }
    }

    bot.onText(/\/id/, async (msg) => {
      await bot.sendMessage(
        msg.chat.id,
        `当前聊天窗口ID:\`${msg.chat.id}\`\n发送消息用户ID:\`${msg.from.id}\``,
        { parse_mode: "MarkdownV2" }
      );
    });
    bot.onText(/\/cleanCookie/, async (msg) => {
      const {
        from: { id: fromID },
        chat: { id: chatID },
      } = msg;
      if (await checkPremission(msg)) {
        await redis.del("mCookie", "cookie");
        bot.sendMessage(chatID, `Cookie清理成功。`);
      }
    });
    bot.onText(/\/file/, async (msg) => {
      const {
        from: { id: fromID },
        chat: { id: chatID },
      } = msg;
      if (await checkPremission(msg)) {
        // 发送所有文件
        readdirSync(join(__dirname, "../data")).forEach(async (file) => {
          await bot
            .sendDocument(chatID, join(__dirname, "../data", file))
            .then((res) => {
              // 删除文件
              rmSync(join(__dirname, "../data", file));
            });
        });
      }
    });
  })
  .catch((err) => {
    console.log(`获取BOT_TOKEN失败。`, err.message);
    process.exit(1);
  });

import routers from "./router";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json({ limit: "100mb" }));

app.use(routers);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export const Delay = (m: number) =>
  new Promise((resolve) => setTimeout(resolve, m * 1000));
