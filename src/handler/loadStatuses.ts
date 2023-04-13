import axios from "axios";

import { Delay, redis } from "../main";
import handleCookieExpire from "./handleCookieExpire";
import loadComments from "./loadComments";

export default async function loadStatuses(moreLink: string, idstr: string) {
    const comments = new Set<string>()
    const sinceIds = new Set<string>()
    try {
        const cookieString = await redis.get("mCookie")
        if (!cookieString) {
            handleCookieExpire("M")
            return Array.from(comments)
        }
        let since_id = undefined
        let page_type = undefined
        let max = 0
        do {
            const { cardlistInfo, cards } = await _loadStatuses(moreLink, since_id, page_type)
            const { page_type: pageType, since_id: sinceId } = cardlistInfo
            since_id = sinceId
            page_type = pageType
            if (sinceId) {
                if (sinceIds.has(sinceId)) {
                    break;
                }
                sinceIds.add(sinceId)
            }
            const statuses = cards.filter(card => card.card_type === 9)
            console.log(`      -获取到${statuses.length}条微博`);
            let allComments = 0
            statuses.forEach(status => {
                const { mblog: { comments_count } } = status
                if (comments_count) {
                    allComments += comments_count
                }
            });
            if (allComments < 3) {
                console.log(`       -当前用户前10条微博评论不足3条`);
                break;
            }
            for (let i = 0; i < statuses.length; i++) {
                const status = statuses[i];
                const { mblog: { id, comments_count } } = status
                if (comments_count) {
                    console.log(`       -第${i + 1}条微博加载到${comments_count}条评论`);
                    const _comments = await loadComments(id)
                    for (let k = 0; k < _comments.length; k++) {
                        const _comment = _comments[k];
                        const { user: commentUser } = _comment
                        const { id: commentUserId, gender, screen_name, comments: replyComments } = commentUser
                        if (idstr !== `${commentUserId}` && gender === "f") {
                            comments.add(screen_name)
                            if (comments.size > 2) {
                                break;
                            }
                        }
                        if (replyComments) {
                            for (let s = 0; s < replyComments.length; s++) {
                                const reply = replyComments[s];
                                const { user: replyUser } = reply
                                const { id: replyUserId, gender: replyUserGender, screen_name: replayUserScreenName } = replyUser
                                if (idstr !== `${replyUserId}` && replyUserGender === "f") {
                                    comments.add(replayUserScreenName)
                                    if (comments.size > 2) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    await Delay(1.5)
                } else {
                    console.log(`       -第${i + 1}条微博没有评论`);
                }
            }
            max++
            await Delay(1)
        } while (comments.size < 3 && max < 10);
        return Array.from(comments)
    } catch (error) {
        return Array.from(comments)
    }
}

async function _loadStatuses(containerid: string, since_id?: string, page_type?: string) {
    try {
        const url = new URL("https://m.weibo.cn/api/container/getIndex")
        url.searchParams.append("containerid", containerid)
        if (since_id) {
            url.searchParams.append("since_id", since_id)
        }
        if (page_type) {
            url.searchParams.append("page_type", page_type)
        }
        const cookiesString = await redis.get("mCookie")
        if (!cookiesString) {
            handleCookieExpire("M")
            return null
        }
        const headers = JSON.parse(cookiesString)
        const { data } = await axios.get(url.href, {
            headers
        })
        if (data && data.ok && data.data) {
            return data.data
        }
        return null

    } catch (error) {
        return null
    }
}