// const axios = require("axios");
// const config = require("./config.json");
import axios from "axios";
import config from "./config.json" assert { type: "json" };
import { request } from "./utils/request";
const contentType = "application/x-www-form-urlencoded; charset=UTF-8";
const cookie =
    "buvid3=EC257E56-E6E1-A230-10DA-79A4644CF59C45947infoc; b_nut=1664032445; _uuid=84E63DBD-188D-95610-1F89-DEC811AB6AB646517infoc; nostalgia_conf=-1; buvid_fp_plain=undefined; LIVE_BUVID=AUTO3216641051179688; hit-dyn-v2=1; buvid4=B4D3E7ED-FB05-CD3C-CD70-11D1F42352A146899-022092423-SZe2GP0VcE9h9ryZO6t%2B2Q%3D%3D; blackside_state=1; hit-new-style-dyn=0; rpdid=|(u~||uJ)~lu0J'uYY)YmulJl; buvid_fp=37b01305dc71b0fcd1ef25dd87a661dd; go_old_video=1; CURRENT_BLACKGAP=0; CURRENT_FNVAL=4048; header_theme_version=CLOSE; i-wanna-go-feeds=-1; bp_video_offset_6459398=771628279803150337; fingerprint=2d7b2bc59e814d1a56da0153853917b9; PVID=1; CURRENT_QUALITY=80; CURRENT_PID=3c6c9660-cac9-11ed-a2a2-c7e84b4b2a58; i-wanna-go-back=-1; is-2022-channel=1; SESSDATA=a7baad6d%2C1695365885%2Cd42d0%2A31; bili_jct=830a30cedcad2b58aa3dee89c0661b5b; DedeUserID=504130688; DedeUserID__ckMd5=3a1204fa9a7468d5; b_ut=5; b_lsid=25B18992_1871E287F77; bsource=search_bing; bp_video_offset_504130688=777346135402479700; innersign=1; sid=6p22krcu";

axios.interceptors.request.use((httpHeaderConfit) => {
    httpHeaderConfit.headers["Content-Type"] = contentType;
    httpHeaderConfit.headers["cookie"] = cookie;
    return httpHeaderConfit;
});

const csrf = "830a30cedcad2b58aa3dee89c0661b5b";
const data = {
    csrf,
    type: 1,
    message: "17",
    oid: 951567225,
};

interface commentData {
    csrf: string,
    type: number,
    message: string,
    oid: number,
}

const sendComment = (data: commentData) => axios.post(config?.commentAPI, data);

const conver2QueryString = (queryData: object) => {
    if (typeof queryData !== "object") return;

    let str: string = "";
    for (const [key, value] of Object.entries(queryData)) {
        str += `${key}=${value}&`;
    }
    return str;
};

interface searchParams {
    keyword: string,
    orderType: string,
    searchType: string,
}

const searchVideos = async ({csrf, message}, { keyword = '', orderType = 'pubdate', searchType = 'video' }: searchParams) => {
    const searchUrl = `${config?.searchAPI}?${conver2QueryString({
        keyword,
        order: orderType,
        search_type: searchType,
    })}`;

    try {
        const res = await axios.get(searchUrl);
        console.log("searchVideos:", res);
        const { data = {} } = res;
        const { result = [] } = data?.data;
        console.log("result:", result);
        result.forEach((video) => {
            sendComment({
                oid: video?.id,
                message: config?.commentKey,
                csrf: config?.csrfToken,
                type: 1,
            });
        });
    } catch (error) {
        console.log("error:", error);
    }
};

searchVideos({
    keyword: config?.searchKey,
    orderType: config?.searchOrderType,
    searchType: config?.searchType,
});
