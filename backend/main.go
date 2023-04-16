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

func main() {
	entity.SetupDatabase()

	cgf := config.LoadConFig(".")
	ctx := context.Background()
	minioClient, err := controller.ConnectMiniO(cgf, ctx)

	if err != nil {
		log.Fatalln(err)
	}
	h := controller.NewHandlerFunc(&cgf)

	// connect minio

	r := gin.Default()

	r.Use(middleware.CORSMiddleware())
	r.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, "service up")
	})
	//--------------minio---------------
	r.POST("/upload", h.UploadPicture(minioClient))

	//--------------Login---------------
	r.POST("/registerCreate", controller.Register)
	r.POST("/login", controller.Login)

	//------------category--------------
	r.GET("/category", controller.GetAllCategory)

	//-----------Post-----------------
	r.POST("/postCreate", h.CreatePost(minioClient))
	r.Run()
}
