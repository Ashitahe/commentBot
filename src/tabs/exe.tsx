import axios from "axios";
import { useEffect, useRef, useState } from "react"

import { Button } from "../components/button"
import { Input } from "../components/inputBox"

import "./exe.styles.less"

const contentType = "application/x-www-form-urlencoded; charset=UTF-8";

const targetUrl = "https://www.bilibili.com"
const loginUrl = "https://passport.bilibili.com/login"
const searchAPI = "https://api.bilibili.com/x/web-interface/wbi/search/type"
const commentAPI = "https://api.bilibili.com/x/v2/reply/add"

axios.interceptors.request.use((httpHeaderConfit) => {
  httpHeaderConfit.headers["Content-Type"] = contentType;
  return httpHeaderConfit;
});

interface commentData {
  csrf: string,
  type: number,
  message: string,
  oid: number,
  plat?: number,
  ordering?: string,
  jsonp?: string,
}

interface searchParams {
  keyword: string,
  orderType: string,
  searchType: string,
}

function IndexPopup() {
  const [searchKey, setSearchKey] = useState("")
  const [comment, setComment] = useState("")
  const csrf = useRef(null)
  const cookie = useRef(null)
  const headers = useRef(null)

  const sendComment = (data: commentData) => axios({
    method: 'post',
    url: commentAPI,
    data,
    headers: headers.current
  });

  const conver2QueryString = (queryData: object) => {
    if (typeof queryData !== "object") return;

    let str: string = "";
    for (const [key, value] of Object.entries(queryData)) {
      str += `${key}=${value}&`;
    }
    return str;
  };

  const searchVideos = async ({ keyword = '', orderType = 'pubdate', searchType = 'video' }: searchParams) => {
    const searchUrl = `${searchAPI}?${conver2QueryString({
      keyword,
      order: orderType,
      search_type: searchType,
    })}`;

    try {
      const res = await axios({
        method: 'get',
        url: searchUrl,
        headers: headers.current,
      });
      console.log("searchVideos:", res);
      const { data = {} } = res;
      const { result = [] } = data?.data;
      console.log("result:", result);
      result.forEach(async (video, idx) => {

        try {
          const res = await sendComment({
            oid: video?.id,
            message: comment,
            csrf: csrf.current,
            type: 1,
            plat: 1,
            ordering: "heat",
            jsonp: "jsonp",
          });
        } catch (error) {
          console.log(error);
        }

      });
    } catch (error) {
      console.log("error:", error);
    }
  };



  const onSubmit = () => {
    console.log("searchKey:", searchKey)
    console.log("comment:", comment)
    searchVideos({
      keyword: searchKey,
      orderType: "pubdate",
      searchType: "video",
    });
  }

  const getCsrf = () => {
    chrome.cookies.get(
      {
        url: targetUrl,
        name: "bili_jct"
      },
      (res) => (csrf.current = res?.value)
    )
  }

  const getCookie = () => {
    chrome.cookies.getAll(
      {
        url: targetUrl
      },
      (res) => {
        const keyVal = res.map((c) => c.name + "=" + c.value)
        cookie.current = keyVal.join(";")
      }
    )
  }

  const toLogin = () => {
    setTimeout(() => {
      window.open(loginUrl)
    }, 1000)
  }

  useEffect(() => {
    getCsrf()
    getCookie()
  }, [])

  useEffect(() => {
    // console.log("cookie:", cookie.current);
    headers.current = {
      "Cookie": cookie.current,
      "Origin": "https://www.bilibili.com"
    }
  }, [cookie])

  return (
    <div className="popupBox">
      <Input
        inputName={"搜索关键字"}
        onChangeValue={setSearchKey}
        placeholder={"请输入搜索关键字"}
      />
      <Input
        inputName={"评论内容"}
        onChangeValue={setComment}
        placeholder={"请输入评论内容"}
      />
      <Button onClick={onSubmit} btnText="submit" />
    </div>
  )
}

export default IndexPopup
