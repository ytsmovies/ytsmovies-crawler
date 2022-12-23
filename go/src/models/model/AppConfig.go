package model

type AppConfig struct {
	AppPort        string
	MaxWorker      int
	RepeatCrawling bool
	DbTemplateName string
	DbLogName      string
	DbName         string
	ApiEndpoint    string
}

func NewAppConfig(appPort string, maxWorker int, repeatCrawling bool, dbTemplateName string, dbLogName string, dbName string, apiEndpoint string) *AppConfig {
	return &AppConfig{AppPort: appPort, MaxWorker: maxWorker, RepeatCrawling: repeatCrawling, DbTemplateName: dbTemplateName, DbLogName: dbLogName, DbName: dbName, ApiEndpoint: apiEndpoint}
}
