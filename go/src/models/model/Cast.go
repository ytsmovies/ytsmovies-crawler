package model

type Cast struct {
    Id   string
    Name string
    UrlImage string
}

func NewCast(id string, name string, urlImage string) *Cast {
    return &Cast{Id: id, Name: name, UrlImage: urlImage}
}

