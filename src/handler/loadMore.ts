import axios from "axios";

export default async function loadMore(url: URL, page: number, headers: { [key: string]: string }) {
    url.searchParams.set("page", page.toString());
    const { data } = await axios.get(url.href, {
        headers
    })
    return data
}