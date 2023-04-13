import { Request, Response, Router } from "express";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import markdownIt from "markdown-it";

import { Delay, bot, redis } from "./main";
import loadUserInfo from "./handler/loadUserInfo";
import loadMore from "./handler/loadMore";
import loadBirthday from "./handler/loadBirthday";
import loadStatuses from "./handler/loadStatuses";
import handleCookieExpire from "./handler/handleCookieExpire";
import handleSendFile from "./handler/handleSendFile";
import { join } from "path";

const md = markdownIt({
    html: true
})
const routers = Router();

routers.post("/location", async (req: Request, res: Response) => {

    let location = undefined
    const users = []

    try {

        const mCookie = await redis.get("mCookie")
        const cookie = await redis.get("cookie")
        if (!mCookie || !cookie) {
            if (!mCookie) {
                handleCookieExpire("M")
            } else {
                handleCookieExpire("Client")
            }
            return res.json({
                msg: "Cookie缺失,请补全后再试."
            })
        }

        const { headers, body, url } = req.body;
        const payload = JSON.parse(body);
        const requestUrl = new URL(url);

        const limit = 10

        if (payload['cardlistInfo'] && requestUrl) {
            location = payload['cardlistInfo']['title_top'];
            const txt = []
            if (
                requestUrl.searchParams.get("page") === "1"
                && !existsSync(join(__dirname, `../data/${location}.txt`))
                && location !== "国内"
                && location !== "热门"
            ) {
                res.json({
                    success: true,
                    msg: `开始采集${location}的数据`
                })
                existsSync(join(__dirname, `../data`)) && mkdirSync(join(__dirname, `../data`), "\n\n");
                writeFileSync(join(__dirname, `../data/${location}.txt`), "\n\n");
                console.log(`开始爬取${location}的数据`);
                let page = 1;
                do {
                    console.log(`  -${location} 第${page}页`);
                    const data = await loadMore(requestUrl, page, headers);
                    const list = data['cards'].filter(card => card['card_type'] === 11);
                    for (let i = 0; i < list.length; i++) {
                        const card = list[i];
                        const _card = card.card_group.filter(card => card.card_type === 9)
                        console.log(`   -有${_card.length}条微博`);
                        for (let k = 0; k < _card.length; k++) {
                            const card = _card[k];
                            console.log(`    -正在检查第${k + 1}条`)
                            if (card['mblog'] && card['mblog']['user']) {
                                const { idstr, gender, followers_count, statuses_count, verified, screen_name, location: userLocation } = card['mblog']['user']
                                if (
                                    gender === "f"
                                    && followers_count < 5000
                                    && verified === false
                                    && statuses_count >= 50
                                ) {
                                    let birthDay = await loadBirthday(idstr)
                                    if (!birthDay) {
                                        birthDay = "#未知"
                                    }
                                    if (typeof birthDay === "string" && birthDay.includes("0000")) {
                                        birthDay = "#未知"
                                    }
                                    const userInfo = await loadUserInfo(idstr)
                                    console.log(`     -加载到用户信息`);
                                    if (userInfo && userInfo['more']) {
                                        console.log("     -加载到所有微博链接");
                                        const moreLink = userInfo['more'].replace("/p/", "")
                                        const commentUsers = await loadStatuses(moreLink, idstr)
                                        if (commentUsers.length > 2) {
                                            bot.sendMessage(process.env.GROUP_ID, md.renderInline(`任务地址:#${location}\n用户:[@${screen_name}](https://m.weibo.cn/profile/${idstr})\nIP归属地:${userLocation}\n生日:${birthDay}\n粉丝数:${followers_count}\n微博数:${statuses_count}\n评论好友:\n    - @${commentUsers.join("\n    - @")}`), { parse_mode: "HTML", disable_web_page_preview: true })
                                                .catch(err => {
                                                    console.log(err.message);
                                                })
                                            users.push(idstr)
                                            txt.push(`用户:@${screen_name}\nIP归属:${userLocation}\n生日:${birthDay}\n粉丝数:${followers_count}\n微博数:${statuses_count}\n评论好友:\n    - @${commentUsers.join(`\n    - @`)}`)
                                            writeFileSync(join(__dirname, `../data/${location}.txt`), txt.join("\n\n"));
                                            if (users.length >= limit) {
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            console.log(" -等待3秒");
                            await Delay(3)
                        }
                    }
                    page++
                    console.log(users.length);
                } while (users.length <= limit);
                writeFileSync(join(__dirname, `../data/${location}.txt`), txt.join("\n\n"));
                await handleSendFile(location, users.length)
            } else {
                if (existsSync(join(__dirname, `../data/${location}.txt`))) {
                    res.json({
                        msg: `${location}采集任务正在进行中`
                    })
                }
            }
        }
    } catch (error) {
        console.log(`【Error】localtionHandler`, error.message);
        handleSendFile(location, users.length)
            .catch(() => { })
        if (!res.headersSent) {
            res.json({
                success: true
            })
        }
    }

})

routers.get("/:id", async (req: Request, res: Response) => {
    const r = await loadUserInfo(req.params.id)
    res.json(r)
})


routers.post("/m-cookie", async (req: Request, res: Response) => {
    try {
        await redis.setex("mCookie", 60 * 10, JSON.stringify(req.body.headers))
        res.json({
            msg: "M站Cookie更新成功"
        })
    } catch (error) {
        res.json({
            msg: "M站Cookie更新失败"
        })
    }
})

routers.post("/cookie", async (req: Request, res: Response) => {
    try {
        await redis.setex("cookie", 60 * 10, JSON.stringify(req.body))
        res.json({
            msg: "Cookie更新成功"
        })
    } catch (error) {
        res.json({
            msg: "Cookie更新失败"
        })
    }
})


export default routers;