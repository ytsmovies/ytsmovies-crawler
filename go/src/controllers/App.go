package controllers

import (
	"database/sql"
	"embed"
	"encoding/json"
	"fmt"
	_ "github.com/mattn/go-sqlite3"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"runtime"
	"sevenperl/yts/crawler/controllers/worker"
	"sevenperl/yts/crawler/models"
	"sevenperl/yts/crawler/models/model"
	"sevenperl/yts/crawler/utils"
	"time"

	"github.com/tidwall/gjson"
)

func MemoryUsage() {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	// For info on each, see: https://golang.org/pkg/runtime/#MemStats
	fmt.Printf("Alloc = %v kB", (m.Alloc / 1024))
	fmt.Printf("\tTotalAlloc = %v kB\n", (m.TotalAlloc / 1024))
}

func LoadConfig() {
	data, err := ioutil.ReadFile(models.AppConfigName)
	if err != nil {
		fmt.Print(err)
	}

	appPort := gjson.Get(string(data), "app_port").String()
	maxWorker := gjson.Get(string(data), "max_worker").Int()
	repeatCrawling := gjson.Get(string(data), "repeat_crawling").Bool()
	dbTemplateName := gjson.Get(string(data), "db_template_name").String()
	dbLogName := gjson.Get(string(data), "db_log_name").String()
	dbName := gjson.Get(string(data), "db_name").String()
	apiEndpoint := gjson.Get(string(data), "api_endpoint").String()

	models.AppConfig = model.NewAppConfig(appPort, int(maxWorker), repeatCrawling,
		dbTemplateName, dbLogName, dbName, apiEndpoint)

	utils.WriteLog("Loaded config file: ", models.AppConfigName, models.AppConfig)

	out, err := json.Marshal(models.AppConfig)
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println(string(out))

}

func LoadHttpClient() {
	tr := &http.Transport{
		MaxIdleConns:    20,
		IdleConnTimeout: 10 * time.Second,
	}
	models.HttpClient = &http.Client{
		Transport: tr,
		Timeout:   10 * time.Second,
	}
}

func InitDatabase() {
	connection, err := sql.Open("sqlite3", filepath.ToSlash("data/"+models.AppConfig.DbLogName))
	if err != nil {
		fmt.Println(err.Error())
	}

	models.AppDatabaseConnection = connection

	fmt.Println("Connected log db: " + filepath.ToSlash("data/"+models.AppConfig.DbLogName))
}

func InitApp() {
	LoadConfig()
	LoadHttpClient()
	InitDatabase()

	MemoryUsage()
	//VerifyApp()
}

func Run(resourcesRoot embed.FS) {
	InitApp()

	//Worker
	worker.Run()
}
