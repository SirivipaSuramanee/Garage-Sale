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
	// โหลดไฟล์จาก app.env มาใช้
	cgf := config.LoadConFig(".")
	// สร้าง context เปล่าๆ มาไว้ใช้กับ miniO
	ctx := context.Background()
	// การเชื่อมต่อ database postgres และ AutoMigrate
	db := entity.SetupDatabase(cgf)
	// การเชื่อมต่อ miniO
	minioClient, err := config.ConnectMiniO(cgf, ctx)

	if err != nil {
		log.Fatalln(err)
	}

	//	สร้าง handler fucn เก็บ cgf db miniO ไว้ในตัว h
	h := controller.NewHandlerFunc(&cgf, db, minioClient)

	// ประกาศ r เรียกใช้ gin library สำหรับการทำ api
	r := gin.Default()

	// ทำ middleware สำหรับการ อณุญาติให้ใช้ GET ,POST ,PATCH , DELETE ,PUT
	r.Use(middleware.CORSMiddleware())

	// api เส้น test http://localhost:8080/test
	r.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, "service up")
	})
	protect := r.Group("")
	// api middleware สำหรับ api ที่ต้องยืนยัน token
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
