import { useEffect, useRef, useState } from "react"

import { Button } from "./components/button"
import { Input } from "./components/inputBox"

import "./styles.less"

const targetUrl = "https://www.bilibili.com"
const loginUrl = "https://passport.bilibili.com/login"

function IndexPopup() {
  const [data, setData] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [comment, setComment] = useState("")
  const csrf = useRef(null)
  const cookie = useRef(null)

  const onSubmit = () => {
    console.log("searchKey:", searchKey)
    console.log("comment:", comment)
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
        console.log("cookie:", cookie.current)
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
