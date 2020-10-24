// app.ts
import {checkSession, code2Session, login, readStorage, setStorage} from "./utils/wx_util";
import {Keys} from "./utils/constants";
import {IAppOption} from "../typings";
import GetUserInfoSuccessCallbackResult = WechatMiniprogram.GetUserInfoSuccessCallbackResult;

async function prefetchData() {
    // 确保登录
    let valid = await checkSession();
    console.log(`session处于有效期：${valid}`)
    if (!valid) {
        let jsCode = await login();
        console.log(`login jsCode=${jsCode}`)
        code2Session(jsCode).then(authSession => {
            console.log(`authSession=${JSON.stringify(authSession)}`)
            setStorage(Keys.KEY_SESSION_KEY, authSession.session_key)
        })
    }
}

App<IAppOption>({
    globalData: {},
    async onLaunch() {
        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        prefetchData().then()
        let result = await readStorage<GetUserInfoSuccessCallbackResult>(Keys.KEY_USER_INFO).catch(_ => undefined)
        if (result) {
            this.globalData.userInfo = result.userInfo;
            console.log(`read userInfo: ${JSON.stringify(result)}`)
            if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(result.userInfo)
            }
        }
    },
})
