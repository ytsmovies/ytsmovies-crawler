package model

type Torrent struct {
	Id           string
	Url          string
	Quality      string
	MediaType    string
	Seed         int
	Peer         int
	Size         int64
	DateUploaded int64
}

func NewTorrent(id string, url string, quality string, mediaType string, seed int, peer int, size int64, dateUploaded int64) *Torrent {
	return &Torrent{Id: id, Url: url, Quality: quality, MediaType: mediaType, Seed: seed, Peer: peer, Size: size, DateUploaded: dateUploaded}
}
