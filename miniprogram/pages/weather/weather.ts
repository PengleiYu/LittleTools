import {Weather} from "./weather_bean";

let url = "https://apis.juhe.cn/simpleWeather/query"


Page({
    data: {
        city: "",
        realtime_temp: "",
        realtime_humidity: "",
        realtime_weather: "",
        realtime_wind_direct: "",
    },
    log2Text(any: any) {
        this.setData({
            text: JSON.stringify(any, null, 2)
        })
    },
    requestWeather() {
        let _this = this;
        wx.request({
            url: url,
            // data: "city=%E5%8C%97%E4%BA%AC&key=fd64bcb04a5b3b2a6e2a6f13c0768893",
            data: {
                city: "北京",
                key: "fd64bcb04a5b3b2a6e2a6f13c0768893",
            },
            success(result) {
                let response_data = result.data as Weather
                _this.log2Text(response_data);

                if (response_data.error_code === 0) {


                    let realtime = response_data.result.realtime;
                    _this.setData({
                        city: response_data.result.city,
                        realtime_temp: realtime.temperature,
                        realtime_humidity: realtime.humidity,
                        realtime_weather: realtime.info,
                        realtime_wind_direct: realtime.direct,
                    })
                }
            },
            fail(err) {
                _this.log2Text(err);
            }
        })
    },
    onReady() {
        this.requestWeather();
    }
})

