import UserContext, { UserContextProvider } from '@contexts/UserContext'
import Taro from '@tarojs/taro'
import React, { useEffect, useContext } from 'react'
import HTTP from '@services/request'
import './app.scss'

import { ENDID } from '@constants/cloud'

// HTTP.init({
//   baseURL: BASE_URL,
//   getToken: () => {
//     return Taro.getStorageSync('LOCAL_USER')?.api_token
//   },
// })

function App(props) {
  const { login } = useContext(UserContext)
  useEffect(() => {
    if (process.env.TARO_ENV === 'weapp') {
      login?.()
      initCloud()
    }
    Taro.hideTabBar()
  }, [])
  function initCloud() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: ENDID,
        traceUser: true,
      })
    }
  }
  return props.children
}

export default function(props) {
  return (
    <UserContextProvider>
      <App>{props.children}</App>
    </UserContextProvider>
  )
}
