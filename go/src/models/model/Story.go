package model

import (
    "github.com/emirpasic/gods/maps/linkedhashmap"
    "strconv"
)

type Story struct {
    Id              string
    MainId          string
    Name            string
    AnotherName     string
    Description     string
    Url             string
    BrokenUrl       bool
    AvatarUrl       string
    Author          string
    Authors         *linkedhashmap.Map
    Genre           string
    Genres          *linkedhashmap.Map
    Status          string
    TeamTranslation string
    Teams           *linkedhashmap.Map
    Views           int64
    UpdatedTime     string
    UpdatedTimeUnix int64
    Chapters        *linkedhashmap.Map
}

func NewStory(id string, mainId string, name string, anotherName string, description string, url string, brokenUrl bool, avatarUrl string, author string, authors *linkedhashmap.Map, genre string, genres *linkedhashmap.Map, status string, teamTranslation string, teams *linkedhashmap.Map, views int64, updatedTime string, updatedTimeUnix int64, chapters *linkedhashmap.Map) *Story {
    return &Story{Id: id, MainId: mainId, Name: name, AnotherName: anotherName, Description: description, Url: url, BrokenUrl: brokenUrl, AvatarUrl: avatarUrl, Author: author, Authors: authors, Genre: genre, Genres: genres, Status: status, TeamTranslation: teamTranslation, Teams: teams, Views: views, UpdatedTime: updatedTime, UpdatedTimeUnix: updatedTimeUnix, Chapters: chapters}
}


func NewEmptyStory() *Story {
    return NewStory("", "", "", "", "", "", true, "",
        "", linkedhashmap.New(), "", linkedhashmap.New(), "", "", linkedhashmap.New(), 0, "", 0, linkedhashmap.New())
}

func (s *Story) String() string {
    //data, _ := json.Marshal(s)
    totalPages := 0
    s.Chapters.Each(func(key interface{}, value interface{}) {
        totalPages += value.(*Chapter).TotalAssets()
    })

    return string(s.Id + "@" + s.Name + "@" + strconv.Itoa(s.Chapters.Size()) + "@" + strconv.Itoa(totalPages) + "@" + strconv.FormatInt(s.Views, 10))
}

func (s *Story) TotalChapters() int {
    if s.Chapters != nil {
        return s.Chapters.Size()
    }
    return 0
}
