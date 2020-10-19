export async function readStorage<T>(key: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
            wx.getStorage({
                key: key,
                success(result) {
                    resolve(result.data)
                },
                fail(err) {
                    reject(new Error(err.errMsg))
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
