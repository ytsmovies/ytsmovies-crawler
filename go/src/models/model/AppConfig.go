package model

type AppConfig struct {
	AppPort        string
	MaxWorker      int
	RepeatCrawling bool
	TimeToSleep    int
	DbTemplateName string
	DbLogName      string
	DbName         string
	ApiEndpoint    string
	ItemPerPage    int
}

func NewAppConfig(appPort string, maxWorker int, repeatCrawling bool, timeToSleep int, dbTemplateName string, dbLogName string, dbName string, apiEndpoint string, itemPerPage int) *AppConfig {
	return &AppConfig{AppPort: appPort, MaxWorker: maxWorker, RepeatCrawling: repeatCrawling, TimeToSleep: timeToSleep, DbTemplateName: dbTemplateName, DbLogName: dbLogName, DbName: dbName, ApiEndpoint: apiEndpoint, ItemPerPage: itemPerPage}
}
