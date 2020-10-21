// app.ts
import {checkSession, code2Session, login as loginImpl, readStorage, setStorage} from "./utils/wx_util";
import {Keys} from "./utils/constants";

async function login() {
    let session_key = await readStorage(Keys.KEY_SESSION_KEY).catch(_ => undefined);
    if (session_key && typeof session_key === 'string') {
        console.log(`read session key: ${session_key}`)
        let valid = await checkSession();
        if (valid) {
            console.log("登录未过期")
            return
        }
        wx.showToast({title: "checkSession过期，重新请求"})
        console.log("checkSession过期，重新请求")
    }
    let jsCode = await loginImpl();
    console.log(`jsCode=${jsCode}`)
    let authSession = await code2Session(jsCode);
    console.log(`authSession=${JSON.stringify(authSession)}`)
    await setStorage(Keys.KEY_SESSION_KEY, authSession.session_key)
}

App<IAppOption>({
    globalData: {},
    onLaunch() {
        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        login().then()

        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        },
                    })
                }
            },
        })
    },
})
