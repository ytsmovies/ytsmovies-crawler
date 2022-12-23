package controllers

import (
	"github.com/gin-gonic/gin"
)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func Home(ctx *gin.Context) {

	data := HomeHandler()

	ctx.HTML(200, "index.gohtml", data)
}

func HomeHandler() interface{} {

	return gin.H{}
}

func BlogTruyen(ctx *gin.Context) {

	data := BlogTruyenHandler()

	ctx.HTML(200, "index.gohtml", data)
}

func BlogTruyenHandler() interface{} {

	return gin.H{}
}

func NetTruyen(ctx *gin.Context) {

	data := NetTruyenHandler()

	ctx.HTML(200, "index.gohtml", data)
}

func NetTruyenHandler() interface{} {

	return gin.H{}
}

func DownloadDb(ctx *gin.Context) {

	data := NetTruyenHandler()

	ctx.HTML(200, "index.gohtml", data)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
