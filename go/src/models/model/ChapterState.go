package model

type ChapterState struct {
	Active  bool
	Chapter *Chapter
}

func NewChapterState(active bool, chapter *Chapter) *ChapterState {
	return &ChapterState{Active: active, Chapter: chapter}
}
