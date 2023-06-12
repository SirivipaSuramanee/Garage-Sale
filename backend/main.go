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

// hello world

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
	protect := r.Group("")
	protect.Use(middleware.Authorizes())

	{
		//--------------minio---------------
		protect.POST("/upload", h.UploadPicture())
		protect.POST("/uploads", h.UploadPictures())

		//------------category--------------
		protect.GET("/category", h.GetAllCategory)

		//-----------Post-----------------
		protect.GET("/favorite", h.GetAllFavorite())
		protect.POST("/favorite", h.CreateMapPostFavorite())
		protect.DELETE("/favorite", h.DeleteLikeMapPostFavorite())

		protect.POST("/postCreate", h.CreatePost())
		protect.GET("/post", h.GetAllPost())
		protect.DELETE("/post/:id", h.DeletePost())
	}

	//--------------Login---------------
	r.POST("/registerCreate", h.Register)
	r.POST("/login", h.Login)
	r.Run()
}
