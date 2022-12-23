package model

type Page struct {
    Id string
    Url string
    Index int
}

func NewPage(id string, url string, index int) *Page {
    return &Page{Id: id, Url: url, Index: index}
}




