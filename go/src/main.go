package main

import (
	"embed"
	_ "embed"
	"sevenperl/yts/crawler/controllers"
)

//go:embed resources
var resourcesRoot embed.FS

func main() {
	controllers.Run(resourcesRoot)
}
