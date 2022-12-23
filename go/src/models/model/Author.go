package model

type Author struct {
    Id   string
    Name string
}

func NewAuthor(id string, name string) *Author {
    return &Author{Id: id, Name: name}
}
