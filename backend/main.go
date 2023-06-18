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
		protect.POST("/uploads", h.UploadPictures())

		//-----------Post-----------------
		protect.GET("/favorite", h.GetAllFavorite())
		protect.POST("/favorite", h.CreateMapPostFavorite())
		protect.DELETE("/favorite", h.DeleteLikeMapPostFavorite())

		protect.POST("/postCreate", h.CreatePost())
		protect.PATCH("/post", h.UpdatePost())
		protect.DELETE("/post/:id", h.DeletePost())
	}

	//--------------Login---------------
	r.POST("/registerCreate", h.Register)
	r.POST("/login", h.Login)
	r.POST("/upload", h.UploadPicture())
	r.GET("/post", h.GetAllPost())
	//------------category--------------
	r.GET("/category", h.GetAllCategory)
	r.Run()
}
