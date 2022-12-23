package model

type Language struct {
	Id string
}

func NewLanguage(id string) *Language {
	return &Language{Id: id}
}
