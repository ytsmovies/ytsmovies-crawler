package models

import (
	"database/sql"
	"net/http"
    "sevenperl/yts/crawler/models/model"
)

var AppConfigName = "config.json"
var AppConfig *model.AppConfig
var AppDatabaseConnection *sql.DB
var BlogTruyenDatabaseConnection *sql.DB
var NetTruyenDatabaseConnection *sql.DB

var HttpClient *http.Client

///////////////////////////////////////////////////////////////////////////////////////////
