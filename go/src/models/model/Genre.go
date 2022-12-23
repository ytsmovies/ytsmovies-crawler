package model

type Genre struct {
    Id   string
    Name string
}

func NewGenre(id string, name string) *Genre {
    return &Genre{Id: id, Name: name}
}
