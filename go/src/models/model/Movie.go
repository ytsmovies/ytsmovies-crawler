package model

import "github.com/emirpasic/gods/lists/singlylinkedlist"

type Movie struct {
	Id               int
	Url              string
	ImdbCode         string
	Title            string
	TitleEng         string
	TitleLong        string
	Slug             string
	Year             int
	Rating           int
	Runtime          int
	DownloadCount    int
	LikeCount        int
	DescriptionIntro string
	DescriptionFull  string
	YtTrailerCode    string
	Language         *Language
	MpaRating        string
	CoverImage       string
	BackgroundImage  string
	ScreenshotImage1 string
	ScreenshotImage2 string
	ScreenshotImage3 string
	DateUploaded     int64

	Genres   *singlylinkedlist.List
	Castings *singlylinkedlist.List
	Torrents *singlylinkedlist.List
}

func NewMovie(id int, url string, imdbCode string, title string, titleEng string, titleLong string, slug string, year int, rating int, runtime int, downloadCount int, likeCount int, descriptionIntro string, descriptionFull string, ytTrailerCode string, language *Language, mpaRating string, coverImage string, backgroundImage string, screenshotImage1 string, screenshotImage2 string, screenshotImage3 string, dateUploaded int64, genres *singlylinkedlist.List, castings *singlylinkedlist.List, torrents *singlylinkedlist.List) *Movie {
	return &Movie{Id: id, Url: url, ImdbCode: imdbCode, Title: title, TitleEng: titleEng, TitleLong: titleLong, Slug: slug, Year: year, Rating: rating, Runtime: runtime, DownloadCount: downloadCount, LikeCount: likeCount, DescriptionIntro: descriptionIntro, DescriptionFull: descriptionFull, YtTrailerCode: ytTrailerCode, Language: language, MpaRating: mpaRating, CoverImage: coverImage, BackgroundImage: backgroundImage, ScreenshotImage1: screenshotImage1, ScreenshotImage2: screenshotImage2, ScreenshotImage3: screenshotImage3, DateUploaded: dateUploaded, Genres: genres, Castings: castings, Torrents: torrents}
}
