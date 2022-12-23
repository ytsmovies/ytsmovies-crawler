package model

type ExtendChapter struct {
	Chapter *Chapter
	Content string
	Size int
}

func NewExtendChapter(chapter *Chapter, content string, size int) *ExtendChapter {
	return &ExtendChapter{Chapter: chapter, Content: content, Size: size}
}

