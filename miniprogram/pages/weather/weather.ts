import {WeatherResponse, Result as WeatherResult} from "./weather_response";
import {readStorage, request, setStorage} from "../../utils/wx_util";

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
        let date = await readStorage<Date>(KEY_WEATHER_SAVE_TIME).catch(_ => undefined);
        console.log(`read last save date: ${date}`)
        let weather: WeatherResult | undefined;
        if (date) {
            let isFreshData = date.getDay() - new Date().getDay() === 0;
            console.log(`weather data is fresh: ${isFreshData}`)
            if (isFreshData) {
                weather = await readStorage<WeatherResult>(KEY_WEATHER).catch(_ => undefined);
            }
        }
        console.log(`read weather: ${weather}`);
        if (!weather) {
            console.log(`get weather failed, request...`)
            weather = await requestWeatherImpl();
            setStorage(KEY_WEATHER_SAVE_TIME, new Date()).then()
        }
        setStorage(KEY_WEATHER, weather).then()
        this.setupWeather(weather)
    },
})

