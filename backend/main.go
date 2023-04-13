package main

import (
	"net/http"

	"github.com/SirivipaSuramanee/controller"
	"github.com/SirivipaSuramanee/entity"
	"github.com/SirivipaSuramanee/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	entity.SetupDatabase()

	r := gin.Default()

	r.Use(middleware.CORSMiddleware())
	r.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, "service up")
	})
	//--------------Login---------------
	r.POST("/registerCreate", controller.Register)
	r.POST("/login", controller.Login)

	//------------category--------------
	r.GET("/category", controller.GetAllCategory)

	//-----------Post-----------------
	r.POST("/postCreate", controller.CreatePost)
	r.Run()
}
