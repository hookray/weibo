import { readFileSync, rmSync } from "fs";
import { bot } from "../main";
import { join } from "path";

export default async function handleSendFile(location: string, length: number) {


    const file = readFileSync(join(__dirname, `../../data/${location}.txt`), "utf-8")

    await bot.sendDocument(process.env.GROUP_ID, Buffer.from(file), {
        caption: `${location} ${length}条任务已经完成`
    }, {
        filename: `${location}.txt`,
        contentType: "text/plain"
    })
    rmSync(`data/${location}.txt`)
}