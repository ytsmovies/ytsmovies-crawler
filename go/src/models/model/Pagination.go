package model

type Pagination struct {
	Page            int64
	ItemPerPage     int64
	TotalPages      int64
	TotalItems      int64
	PaginationItems []*PaginationItem
}

func NewPagination(page int64, itemPerPage int64, totalPages int64, totalItems int64, paginationItems []*PaginationItem) *Pagination {
	return &Pagination{Page: page, ItemPerPage: itemPerPage, TotalPages: totalPages, TotalItems: totalItems, PaginationItems: paginationItems}
}
