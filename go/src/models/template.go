package models

var SQL_LOG_ITEM = "insert into LOG(id, start_time, end_time, running_time, total_stories, total_chapters, site_type) values(?, ?, ?, ?, ?, ?, ?)"

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core
var SQL_INSERT_AUTHOR = `insert into AUTHOR(id, name) values(?, ?)`
var SQL_INSERT_HAS_AUTHOR = `insert into HAS_AUTHOR(story_id, author_id) values(?, ?)`
var SQL_INSERT_GENRE = `insert into GENRE(id, name) values(?, ?)`
var SQL_INSERT_HAS_GENRE = `insert into HAS_GENRE(story_id, genre_id) values(?, ?)`
var SQL_INSERT_TEAM = `insert into TEAM(id, name, homepage) values(?, ?, ?)`
var SQL_INSERT_HAS_TEAM = `insert into HAS_TEAM(story_id, team_id) values(?, ?)`
var SQL_INSERT_STORY = `insert into STORY(id, name, another_name, description, url, broken_url, avatar_url, status, views, total_chapters, updated_time, updated_time_unix) 
                        values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
var SQL_INSERT_CHAPTER = `insert into CHAPTER(id, url, name, updated_time, updated_time_unix, chapter_index, story_id) values(?, ?, ?, ?, ?, ?, ?)`
var SQL_INSERT_PAGE = "insert into PAGE(id, url, page_index, chapter_id) values(?, ?, ?, ?)"

var SQL_INSERT_MOVIE = `insert into MOVIE(id, url, imdb_code, title, title_english, title_long, slug, 
											year, rating, runtime, download_count, like_count, 
											description_intro, description_full, yt_trailer_code, language_id, mpa_rating,
											background_image, cover_image, screenshot_image1, screenshot_image2, screenshot_image3,
											date_uploaded) 
                        values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
								?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
								?, ?, ?)`
var SQL_INSERT_CAST = `insert into CAST(id, name, url_image) values(?, ?, ?)`

var SQL_INSERT_LANGUAGE = `insert into LANGUAGE(id) values(?)`
var SQL_INSERT_TORRENT = `insert into TORRENT(id, url, quality, media_type, seed, peer, size, date_uploaded, movie_id) 
						values(?, ?, ?, ?, ?, ?, ?, ?, ?)`

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var RESULT_TEMPLATE = `{
    "statusCode": %d,
    "data": %s }`
var ARRAY_TEMPLATE = `[%s]`
var OBJECT_TEMPLATE = `{%s}`
var ITEM_TEMPLATE = `"%s":"%s"`
var ITEM2_TEMPLATE = `"%s":%d`
var ITEM3_TEMPLATE = `"%s":%f`
var ITEM4_TEMPLATE = `"%s": [%s]`
var ITEM5_TEMPLATE = `"%s": {%s}`
var ITEM6_TEMPLATE = `"%s": %s`
var ITEM7_TEMPLATE = `"%s"`
var ITEM8_TEMPLATE = `"%s":%t`
