import {Result as WeatherResult, WeatherResponse} from "./weather_response";
import {code2Session, login, readStorage, request, setStorage} from "../../utils/wx_util";
import {Keys} from "../../utils/constants";

let url = "https://apis.juhe.cn/simpleWeather/query";
let KEY_WEATHER = "key_weather";
let KEY_WEATHER_SAVE_TIME = "key_weather_save_time";

async function requestWeatherImpl(): Promise<WeatherResult> {
    let response: WeatherResponse = await request(url, {
        city: "北京",
        key: "fd64bcb04a5b3b2a6e2a6f13c0768893",
    });
    if (response.error_code !== 0) {
        throw new Error(JSON.stringify(response))
    }
    return response.result;
}

Page({
    data: {
        city: "",
        realtime_temp: "",
        realtime_humidity: "",
        realtime_weather: "",
        realtime_wind_direct: "",
        realtime_wind_power: "",
        realtime_air_quality_index: "",
        has_user_info: false,
    },
    log2Text(any: any) {
        this.setData({
            text: JSON.stringify(any, null, 2)
        })
    },
    setupWeather(data: WeatherResult) {
        let realtime = data.realtime;
        this.setData({
            city: data.city,
            realtime_temp: realtime.temperature,
            realtime_humidity: realtime.humidity,
            realtime_weather: realtime.info,
            realtime_wind_direct: realtime.direct,
            realtime_wind_power: realtime.power,
            realtime_air_quality_index: realtime.aqi,
        })
    },
    async onReady() {
        login().then()
        let date = await readStorage<Date>(KEY_WEATHER_SAVE_TIME).catch(_ => undefined);
        console.log(`read last saved date: ${date}`)
        let weather: WeatherResult | undefined;
        if (date) {
            let isFreshData = date.getDay() - new Date().getDay() === 0;
            console.log(`weather data is fresh: ${isFreshData}`)
            if (isFreshData) {
                weather = await readStorage<WeatherResult>(KEY_WEATHER).catch(_ => undefined);
            }
        }
        console.log(`read last saved weather: ${weather}`);
        if (!weather) {
            console.log(`get weather failed, request...`)
            weather = await requestWeatherImpl();
            setStorage(KEY_WEATHER_SAVE_TIME, new Date()).then()
        }
        setStorage(KEY_WEATHER, weather).then()
        this.setupWeather(weather)
    },
    async onLoad(_: Record<string, string | undefined>) {
        let userInfo = await readStorage(Keys.KEY_USER_INFO).catch(_ => undefined);
        this.setData({
            has_user_info: userInfo !== undefined
        })
    },

    async login() {
        let jsCode = await login();
        console.log(`jsCode=${jsCode}`)
        let authSession = await code2Session(jsCode);
        console.log(`authSession=${JSON.stringify(authSession)}`)
    },
    //只有企业用户才能使用
    getPhoneNumber(e: any) {
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
    }
})

