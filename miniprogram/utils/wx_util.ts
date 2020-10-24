import {APP_CONFIG} from "./constants";
import {AuthSession} from "./wx_beans";
import GetUserInfoSuccessCallbackResult = WechatMiniprogram.GetUserInfoSuccessCallbackResult;

export async function readStorage<T>(key: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
            wx.getStorage({
                key: key,
                success(result) {
                    resolve(result.data)
                },
                fail(err) {
                    reject(new Error(err.errMsg + ", key = " + key))
                }
            })
        }
    )
}

export async function setStorage<T>(key: string, value: T) {
    return new Promise<string>(((resolve, reject) => {
        wx.setStorage({
            key: key,
            data: value,
            success(result) {
                resolve(result.errMsg)
            },
            fail(err) {
                reject(new Error(err.errMsg))
            }
        })
    }))
}

export async function request<T>(url: string, data: Record<string, any>): Promise<T> {
    return new Promise(((resolve, reject) => {
        wx.request({
            url: url,
            data: data,
            success(result) {
                resolve(result.data as T)
            },
            fail(err) {
                reject(new Error(err.errMsg))
            }
        })
    }))
}

export async function login(): Promise<string> {
    return new Promise(((resolve, reject) => {
        wx.login({
            success(result) {
                resolve(result.code)
            },
            fail(err) {
                reject(new Error(err.errMsg))
            }
        })
    }))
}

export async function checkSession(): Promise<boolean> {
    return new Promise(((resolve, _) => {
        wx.checkSession({
            success() {
                resolve(true)
            },
            fail() {
                resolve(false)
            }
        })
    }))
}

export async function code2Session(js_code: string): Promise<AuthSession> {
    let url = "https://www.penglei.tech:8888/wx_mini/code2session"
    return request(url, {
        appid: APP_CONFIG.appId,
        secret: APP_CONFIG.secret,
        js_code: js_code,
        // grant_type: "authorization_code",
    })
}

export async function decodeData(encryptedData: string, iv: string, sessionKey: string) {
    let url = "https://www.penglei.tech:8888/wx_mini/decode"
    return request(url, {
        encryptedData: encryptedData,
        iv: iv,
        sessionKey: sessionKey,
    })
}

export async function getUserInfo(): Promise<GetUserInfoSuccessCallbackResult> {
    return new Promise(((resolve, reject) => {
        wx.getUserInfo({
            withCredentials: true,
            success(result) {
                resolve(result)
            },
            fail(err) {
                reject(new Error(err.errMsg))
            }
        })
    }))
}
