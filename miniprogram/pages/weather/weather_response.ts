export type Realtime = {
    temperature: string;
    humidity: string;
    info: string;
    wid: string;
    direct: string;
    power: string;
    aqi: string;
}

export type Wid = {
    day: string;
    night: string;
}

export type Future = {
    date: string;
    temperature: string;
    weather: string;
    wid: Wid;
    direct: string;
}

export type Result = {
    city: string;
    realtime: Realtime;
    future: Future[];
}

export type WeatherResponse = {
    reason: string;
    result: Result;
    error_code: number;
}
/**
 {
	"reason":"查询成功!",
	"result":{
		"city":"海淀",
		"realtime":{
			"temperature":"19",
			"humidity":"27",
			"info":"晴",
			"wid":"00",
			"direct":"西风",
			"power":"2级",
			"aqi":"53"
		},
		"future":[
			{
				"date":"2020-10-19",
				"temperature":"8\/22℃",
				"weather":"晴转多云",
				"wid":{
					"day":"00",
					"night":"01"
				},
				"direct":"南风转西南风"
			},
			{
				"date":"2020-10-20",
				"temperature":"8\/19℃",
				"weather":"多云",
				"wid":{
					"day":"01",
					"night":"01"
				},
				"direct":"南风转西北风"
			},
			{
				"date":"2020-10-21",
				"temperature":"4\/16℃",
				"weather":"晴",
				"wid":{
					"day":"00",
					"night":"00"
				},
				"direct":"西北风转北风"
			},
			{
				"date":"2020-10-22",
				"temperature":"4\/17℃",
				"weather":"晴",
				"wid":{
					"day":"00",
					"night":"00"
				},
				"direct":"北风转西北风"
			},
			{
				"date":"2020-10-23",
				"temperature":"4\/17℃",
				"weather":"晴",
				"wid":{
					"day":"00",
					"night":"00"
				},
				"direct":"南风转北风"
			}
		]
	},
	"error_code":0
}

 */
