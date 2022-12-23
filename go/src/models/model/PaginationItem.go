package model

type PaginationItem struct {
	Name     string
	Active   bool
	Url      string
	ItemType int
}

func NewPaginationItem(name string, active bool, url string, itemType int) *PaginationItem {
	return &PaginationItem{Name: name, Active: active, Url: url, ItemType: itemType}
}

//0 - first
//1 - previous
//2 - normal
//3 - next
//4 - last
