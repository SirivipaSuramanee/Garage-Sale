package main

import (
	"context"
	"log"
	"net/http"

	"github.com/SirivipaSuramanee/config"
	"github.com/SirivipaSuramanee/controller"
	"github.com/SirivipaSuramanee/entity"
	"github.com/SirivipaSuramanee/middleware"
	"github.com/gin-gonic/gin"
)

// hello

func main() {

	cgf := config.LoadConFig(".")
	ctx := context.Background()
	db := entity.SetupDatabase(cgf)
	minioClient, err := config.ConnectMiniO(cgf, ctx)

	if err != nil {
		log.Fatalln(err)
	}
	h := controller.NewHandlerFunc(&cgf, db, minioClient)

	// connect minio

	r := gin.Default()

	r.Use(middleware.CORSMiddleware())
	r.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, "service up")
	})
	//--------------minio---------------
	r.POST("/upload", h.UploadPicture())

	//--------------Login---------------
	r.POST("/registerCreate", h.Register)
	r.POST("/login", h.Login)

	//------------category--------------
	r.GET("/category", h.GetAllCategory)

	//-----------Post-----------------
	r.POST("/postCreate", h.CreatePost())
	r.GET("/post", h.GetAllPost)

	r.Run()
}
