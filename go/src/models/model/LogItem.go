package model

type LogItem struct {
	Id          string
	StartTime   int64
	EndTime     int64
	RunningTime int64
	TotalMovies int
}

func NewLogItem(id string, startTime int64, endTime int64, runningTime int64, totalMovies int) *LogItem {
	return &LogItem{Id: id, StartTime: startTime, EndTime: endTime, RunningTime: runningTime, TotalMovies: totalMovies}
}
