package dal

import (
	"database/sql"

	"log"
	"sevenperl/yts/crawler/models"
	"sevenperl/yts/crawler/models/model"
)

func LogCrawler(Db *sql.DB, item *model.LogItem) {
	ExecuteSQL(Db, models.SQL_LOG_ITEM, item.Id, item.StartTime, item.EndTime, item.RunningTime, item.TotalMovies)
}

///////////////////////////////////////////////////////////////////
//Base Query

func QueryRow(Db *sql.DB, sql string, params ...interface{}) *sql.Row {
	st, err := Db.Prepare(sql)
	if err != nil {
		log.Fatal(err)
	}

	return st.QueryRow(params...)
}

func QuerySQL(Db *sql.DB, sql string, params ...interface{}) (*sql.Rows, interface{}) {
	st, err := Db.Prepare(sql)
	if err != nil {
		log.Fatal(err)
	}

	return st.Query(params...)
}

func ExecuteSQL(Db *sql.DB, sql string, params ...interface{}) sql.Result {
	tx, err := Db.Begin()
	if err != nil {
		//Writel(err.Error())
	}

	prepareSt, err := tx.Prepare(sql)
	if err != nil {
		log.Fatal(err)
	}

	result, _ := prepareSt.Exec(params...)

	tx.Commit()

	return result
}

func ExecuteSQLWithTransaction(tx *sql.Tx, sql string, params ...interface{}) sql.Result {
	prepareSt, err := tx.Prepare(sql)
	if err != nil {
		log.Fatal(err)
	}

	result, _ := prepareSt.Exec(params...)

	return result
}

func QuerySQLWithTransaction(tx *sql.Tx, sql string, params ...interface{}) (*sql.Rows, interface{}) {
	st, err := tx.Prepare(sql)
	if err != nil {
		log.Fatal(err)
	}

	return st.Query(params...)
}

///////////////////////////////////////////////////////////////////
