package controller

import (
	"fmt"
	"net/http"

	"github.com/SirivipaSuramanee/entity"
	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
)

func (h *HandlerFunc) CreatePost(minioClient *minio.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var post entity.Post
		//var catetagory entity.Catetagory

		if err := c.BindJSON(&post); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// if tx := entity.DB().Where("id = ?", post.CatetagoryID).First(&catetagory); tx.RowsAffected == 0 {
		// 	c.JSON(http.StatusBadRequest, gin.H{"error": "Category not found"})
		// 	return
		// }

		// CP := entity.Post{
		// 	Topic:         post.Topic,
		// 	Catetagory:    catetagory,
		// 	Price:         post.Price,
		// 	Picture:       post.Picture, //###############
		// 	DayTime_Open:  post.DayTime_Open,
		// 	DayTime_Close: post.DayTime_Close,
		// 	Detail:        post.Detail,
		// }

		// if err := entity.DB().Create(&CP).Error; err != nil {
		// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		// 	return
		// }
		fmt.Print(post.Picture)
		c.JSON(http.StatusOK, gin.H{"data": post}) //ส่ง BP กลับไปตรงที่ fetch ที่เราเรียกใช้
	}

}

func GetAllPost(c *gin.Context) {

	var post []entity.Post

	if err := entity.DB().Model(&entity.Post{}).Scan(&post).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": post})

}
