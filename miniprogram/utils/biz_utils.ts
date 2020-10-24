import {decodeData, readStorage, setStorage} from "./wx_util";
import {Keys} from "./constants";


/**
 * 保存userInfo并请求解密
 */
export async function saveUserInfo(userInfo: WechatMiniprogram.GetUserInfoSuccessCallbackResult) {
    console.log(`saveUserInfo: ${JSON.stringify(userInfo)}`)
    await setStorage(Keys.KEY_USER_INFO, userInfo)
    let session_key = await readStorage<string>(Keys.KEY_SESSION_KEY);
    let data = await decodeData(userInfo.encryptedData, userInfo.iv, session_key);
    console.log(`decode data: ${JSON.stringify(data)}`)
}
