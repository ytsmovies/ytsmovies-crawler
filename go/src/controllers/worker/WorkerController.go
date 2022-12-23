package worker

import (
	"database/sql"
	"fmt"
	"github.com/emirpasic/gods/lists/singlylinkedlist"
	"github.com/emirpasic/gods/maps/linkedhashmap"
	"github.com/emirpasic/gods/sets/hashset"
	"github.com/go-resty/resty/v2"
	"github.com/schollz/progressbar/v3"
	"github.com/tidwall/gjson"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"sevenperl/yts/crawler/dal"
	"sevenperl/yts/crawler/models"
	"sevenperl/yts/crawler/models/model"
	"sevenperl/yts/crawler/utils"
	"time"
)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Init feature

func initWorker() {
	DbNameTmp = "_tmp_" + models.AppConfig.DbName

	//Reset state
	os.Remove(filepath.ToSlash("data/" + DbNameTmp))
	//Read all the contents of the  original file
	bytesRead, err := ioutil.ReadFile(filepath.ToSlash("data/" + models.AppConfig.DbTemplateName))
	if err != nil {
		log.Fatal(err)
	}

	//Copy all the contents to the desitination file
	err = ioutil.WriteFile(filepath.ToSlash("data/"+DbNameTmp), bytesRead, 0755)
	if err != nil {
		log.Fatal(err)
	}

	initDatabase()

}

func initDatabase() {
	var err error
	DbConnection, err = sql.Open("sqlite3", filepath.ToSlash("data/"+DbNameTmp))
	if err != nil {
		fmt.Println(err.Error())
	}
	fmt.Println("Connected db: " + DbNameTmp)
}

func closeDb() {
	DbConnection.Close()
}

func detachSession() {
	closeDb()

	os.Remove(filepath.ToSlash("data/" + models.AppConfig.DbName))
	os.Rename(filepath.ToSlash("data/"+DbNameTmp), filepath.ToSlash("data/"+models.AppConfig.DbName))

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Utils

func BuildPagePath(page int) string {
	urlTpl := "https://yts.mx/api/v2/list_movies.json?limit=%d&page=%d"
	endpoint := fmt.Sprintf(urlTpl, 50, page)
	//fmt.Println(url)
	return endpoint
}

func BuildPagePath2(movieId int) string {
	urlTpl := "https://yts.mx/api/v2/movie_details.json?movie_id=%d&with_images=true&with_cast=true"
	endpoint := fmt.Sprintf(urlTpl, movieId)
	//fmt.Println(url)
	return endpoint
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Implement feature

func GetDataFromUrl(urlPage string, c chan string) {
	c <- utils.MakeRequest(models.HttpClient, urlPage, http.MethodGet, nil, nil)
}

func getMovieCount() int64 {
	var movieCount int64
	client := resty.New()
	resp, err := client.R().Get("https://yts.mx/api/v2/list_movies.json")

	if err != nil {
		movieCount = 0
	}

	utils.WriteLog(string(resp.Body()))
	if resp.StatusCode() == 200 {
		movieCount = gjson.Get(resp.String(), "data.movie_count").Int()
	} else {
		movieCount = 0
	}

	return movieCount
}

func getTotalMovieIds() *hashset.Set {
	movieIds := hashset.New()

	movieCount := getMovieCount()
	utils.WriteLog(movieCount)

	itemPerPage := 50
	totalPages := int(math.Ceil(float64(movieCount) / float64(itemPerPage)))
	utils.WriteLog(totalPages)

	//Start craw
	queue := model.NewQueue()

	//1. Build a queue
	for index := 1; index <= totalPages; index++ {
		queue.Push(index)
	}

	bar := progressbar.Default(int64(totalPages))

	//2. Share jobs to workers
	movieChan := make(chan string, models.AppConfig.MaxWorker)
	runningWorker := 0

	for !queue.IsEmpty() && runningWorker < models.AppConfig.MaxWorker {
		//fmt.Println("Created story worker.")
		item := queue.Pop().(int)
		go GetDataFromUrl(BuildPagePath(item), movieChan)
		runningWorker++
	}

	done := false
	for !done {
		select {
		case str := <-movieChan:
			//Process returned page data
			if str != "" {
				if gjson.Get(str, "data.movies").Exists() {
					gjson.Get(str, "data.movies").ForEach(func(key, value gjson.Result) bool {
						movieIds.Add(int(value.Get("id").Int()))
						return true
					})
				}
			}

			bar.Add(1)

			runningWorker--
			//utils.WriteLog("runningWorker: ", runningWorker)

			if !queue.IsEmpty() {
				item := queue.Pop().(int)
				runningWorker++
				go GetDataFromUrl(BuildPagePath(item), movieChan)
			}
		default:
			if runningWorker == 0 && queue.IsEmpty() {
				done = true
			}
		}
	}

	return movieIds
}

func getMovieDetails(movieIds *hashset.Set, genres *linkedhashmap.Map, casts *linkedhashmap.Map, langs *linkedhashmap.Map) *linkedhashmap.Map {
	movies := linkedhashmap.New()

	//Start craw
	queue := model.NewQueue()

	//1. Build a queue
	for _, v := range movieIds.Values() {
		queue.Push(v)
	}

	//queue.Push(1)
	//queue.Push(2)
	//queue.Push(3)

	bar := progressbar.Default(int64(movieIds.Size()))

	//2. Share jobs to workers
	movieChan := make(chan string, models.AppConfig.MaxWorker)
	runningWorker := 0

	for !queue.IsEmpty() && runningWorker < models.AppConfig.MaxWorker {
		//fmt.Println("Created movie worker.")
		item := queue.Pop().(int)
		go GetDataFromUrl(BuildPagePath2(item), movieChan)
		runningWorker++
	}

	done := false
	for !done {
		select {
		case str := <-movieChan:
			//Process returned page data
			if str != "" {
				id := gjson.Get(str, "data.movie.id").Int()
				url := gjson.Get(str, "data.movie.url").String()
				imdbCode := gjson.Get(str, "data.movie.imdb_code").String()
				title := gjson.Get(str, "data.movie.title").String()
				titleEng := gjson.Get(str, "data.movie.title_english").String()
				titleLong := gjson.Get(str, "data.movie.title_long").String()
				slug := gjson.Get(str, "data.movie.slug").String()
				year := gjson.Get(str, "data.movie.year").Int()
				rating := gjson.Get(str, "data.movie.rating").Int()
				runtime := gjson.Get(str, "data.movie.runtime").Int()
				downloadCount := gjson.Get(str, "data.movie.download_count").Int()
				likeCount := gjson.Get(str, "data.movie.like_count").Int()
				descriptionIntro := gjson.Get(str, "data.movie.description_intro").String()
				descriptionFull := gjson.Get(str, "data.movie.description_full").String()
				ytTrailerCode := gjson.Get(str, "data.movie.yt_trailer_code").String()
				languageId := gjson.Get(str, "data.movie.language").String()
				mpaRating := gjson.Get(str, "data.movie.mpa_rating").String()
				coverImage := gjson.Get(str, "data.movie.large_cover_image").String()
				backgroundImage := gjson.Get(str, "data.movie.background_image_original").String()
				screenshotImage1 := gjson.Get(str, "data.movie.large_screenshot_image1").String()
				screenshotImage2 := gjson.Get(str, "data.movie.large_screenshot_image2").String()
				screenshotImage3 := gjson.Get(str, "data.movie.large_screenshot_image3").String()
				dateUploaded := gjson.Get(str, "data.movie.date_uploaded_unix").Int()

				//Parse torrents
				torrents := singlylinkedlist.New()
				gjson.Get(str, "data.movie.torrents").ForEach(func(key, value gjson.Result) bool {
					id := value.Get("hash").String()
					url := value.Get("url").String()
					quality := value.Get("quality").String()
					mediaType := value.Get("type").String()
					seed := value.Get("seeds").Int()
					peer := value.Get("peers").Int()
					size := value.Get("size_bytes").Int()
					dateUploaded := value.Get("date_uploaded_unix").Int()

					torrents.Add(model.NewTorrent(id, url, quality, mediaType, int(seed), int(peer), size, dateUploaded))

					return true
				})

				var lang *model.Language
				if v, found := langs.Get(languageId); !found {
					lang = model.NewLanguage(languageId)
					langs.Put(languageId, lang)
				} else {
					lang = v.(*model.Language)
				}

				mv := model.NewMovie(int(id), url, imdbCode, title, titleEng, titleLong, slug,
					int(year), int(rating), int(runtime), int(downloadCount), int(likeCount),
					descriptionIntro, descriptionFull, ytTrailerCode, lang, mpaRating,
					coverImage, backgroundImage, screenshotImage1, screenshotImage2, screenshotImage3, dateUploaded,
					nil, nil, torrents)
				movies.Put(mv.Id, mv)

				//Genres
				gjson.Get(str, "data.movie.genres").ForEach(func(key, value gjson.Result) bool {
					if _, found := genres.Get(value.String()); !found {
						genres.Put(value.String(), model.NewGenre(value.String(), ""))
					}

					return true
				})

				//Casts
				gjson.Get(str, "data.movie.cast").ForEach(func(key, value gjson.Result) bool {
					if _, found := casts.Get(value.Get("imdb_code").String()); !found {
						casts.Put(value.Get("imdb_code").String(), model.NewCast(value.Get("imdb_code").String(),
							value.Get("name").String(), value.Get("url_small_image").String()))
					}

					return true
				})

			}

			bar.Add(1)

			runningWorker--
			//utils.WriteLog("runningWorker: ", runningWorker)

			if !queue.IsEmpty() {
				item := queue.Pop().(int)
				runningWorker++
				go GetDataFromUrl(BuildPagePath2(item), movieChan)
			}
		default:
			if runningWorker == 0 && queue.IsEmpty() {
				done = true
			}
		}
	}

	return movies
}

func writeToDb(movies *linkedhashmap.Map, genres *linkedhashmap.Map, casts *linkedhashmap.Map, langs *linkedhashmap.Map) {
	tx, err := DbConnection.Begin()

	genres.Each(func(key interface{}, value interface{}) {
		genre := value.(*model.Genre)
		dal.ExecuteSQLWithTransaction(tx, models.SQL_INSERT_GENRE, genre.Id, genre.Name)
	})

	casts.Each(func(key interface{}, value interface{}) {
		cast := value.(*model.Cast)
		dal.ExecuteSQLWithTransaction(tx, models.SQL_INSERT_CAST, cast.Id, cast.Name, cast.UrlImage)
	})

	langs.Each(func(key interface{}, value interface{}) {
		lang := value.(*model.Language)
		dal.ExecuteSQLWithTransaction(tx, models.SQL_INSERT_LANGUAGE, lang.Id)
	})

	movies.Each(func(key interface{}, value interface{}) {

		if err != nil {
			fmt.Println(err.Error())
		}
		movie := value.(*model.Movie)
		dal.ExecuteSQLWithTransaction(tx, models.SQL_INSERT_MOVIE,
			movie.Id, movie.Url, movie.ImdbCode, movie.Title, movie.TitleEng, movie.TitleLong, movie.Slug,
			movie.Year, movie.Rating, movie.Runtime, movie.DownloadCount, movie.LikeCount,
			movie.DescriptionIntro, movie.DescriptionFull, movie.YtTrailerCode, movie.Language.Id, movie.MpaRating,
			movie.CoverImage, movie.BackgroundImage, movie.ScreenshotImage1, movie.ScreenshotImage2, movie.ScreenshotImage3,
			movie.DateUploaded)

		movie.Torrents.Each(func(index int, value interface{}) {
			tor := value.(*model.Torrent)
			dal.ExecuteSQLWithTransaction(tx, models.SQL_INSERT_TORRENT,
				tor.Id, tor.Url, tor.Quality, tor.MediaType, tor.Seed, tor.Peer, tor.Size, tor.DateUploaded, movie.Id)
		})
	})

	tx.Commit()
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var DbNameTmp = ""
var DbConnection *sql.DB

func Crawl(w chan string) {
	startTime := time.Now()

	initWorker()

	//Get total movie ids
	movieIds := getTotalMovieIds()
	utils.WriteLog("Total movie ids: ", movieIds.Size())

	//Get movies detail
	genres := linkedhashmap.New()
	casts := linkedhashmap.New()
	langs := linkedhashmap.New()
	movies := getMovieDetails(movieIds, genres, casts, langs)
	utils.WriteLog("Total movies: ", movies.Size())
	utils.WriteLog("Total genres: ", genres.Size())
	utils.WriteLog("Total casts: ", casts.Size())
	utils.WriteLog("Total langs: ", langs.Size())

	writeToDb(movies, genres, casts, langs)

	detachSession()

	endTime := time.Since(startTime)
	utils.WriteLog("Running time: ", endTime.Seconds(), "s")

	time.Sleep(30 * time.Second)
	w <- "yts--------"
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func Run() {
	ytsChan := make(chan string)

	go Crawl(ytsChan)

	for {
		select {
		case r1 := <-ytsChan:
			fmt.Println(r1)
			go Crawl(ytsChan)
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
