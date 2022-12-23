package model

type LogItem struct {
    Id           string
    StartTime    int64
    EndTime      int64
    RunningTime  int64
    TotalStories int
    TotalChapter int
    SiteType     int
}

func NewLogItem(id string, startTime int64, endTime int64, runningTime int64, totalStories int, totalChapter int, siteType int) *LogItem {
    return &LogItem{Id: id, StartTime: startTime, EndTime: endTime, RunningTime: runningTime, TotalStories: totalStories, TotalChapter: totalChapter, SiteType: siteType}
}

//0 - blogtruyen
//1 - nettruyen
