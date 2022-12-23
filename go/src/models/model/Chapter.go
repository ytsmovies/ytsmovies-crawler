package model

import "github.com/emirpasic/gods/lists/singlylinkedlist"

type Chapter struct {
	Id              string
	Url             string
	Name            string
	UpdatedTime     string
	UpdatedTimeUnix int64
	Index           int
	Pages           *singlylinkedlist.List
}

func NewChapter(id string, url string, name string, updatedTime string, updatedTimeUnix int64, index int, pages *singlylinkedlist.List) *Chapter {
	return &Chapter{Id: id, Url: url, Name: name, UpdatedTime: updatedTime, UpdatedTimeUnix: updatedTimeUnix, Index: index, Pages: pages}
}

func (chapter *Chapter) TotalAssets() int {
	if chapter.Pages != nil {
		return chapter.Pages.Size()
	}
	return 0
}
