// index.ts
// 获取应用实例
import {BindFunctionResult} from "../../utils/wx_beans";
import {saveUserInfo} from "../../utils/biz_utils";
import GetUserInfoSuccessCallbackResult = WechatMiniprogram.GetUserInfoSuccessCallbackResult;
import {IAppOption, IIndexData, IIndexPage} from "../../../typings";

const app = getApp<IAppOption>()

Page<IIndexData, IIndexPage>({
    data: {
        // motto: 'Hello World',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        hasUserInfo: false,
    },
    // 事件处理函数
    // bindViewTap() {
    //     wx.navigateTo({
    //         url: '../logs/logs',
    //     })
    // },
    onLoad() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true,
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            console.log(`register userInfoReadyCallback`)
            app.userInfoReadyCallback = res => {
                console.log(`setData: userInfo`)
                this.setData({
                    userInfo: res,
                    hasUserInfo: true,
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true,
                    })
                },
            })
        }
    },
    async getUserInfo(result: BindFunctionResult<GetUserInfoSuccessCallbackResult>) {
        console.log(`getUserInfo: ${JSON.stringify(result)}`)
        if (result.detail.errMsg.indexOf("ok") == -1) {
            console.log(`getUserInfo fail`)
            return
        }
        let userInfo = result.detail;
        await saveUserInfo(userInfo)
        if (app.userInfoReadyCallback) {
            app.userInfoReadyCallback(result.detail.userInfo)
        }
        // this.setData({
        //     hasUserInfo: true,
        // })
    },
})
