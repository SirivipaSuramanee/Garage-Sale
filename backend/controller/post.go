package controller

import (
	"net/http"

	"github.com/SirivipaSuramanee/entity"
	"github.com/gin-gonic/gin"
)

func (h *HandlerFunc) CreatePost() gin.HandlerFunc {
	return func(c *gin.Context) {
		var post entity.Post
		var category entity.Category

		if err := c.BindJSON(&post); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if tx := h.pgDB.Where("id = ?", post.CategoryID).First(&category); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Category not found"})
			return
		}

		CP := entity.Post{
			Topic:        post.Topic,
			Category:     category,
			Price:        post.Price,
			Picture:      post.Picture, //###############
			DayTimeOpen:  post.DayTimeOpen,
			DayTimeClose: post.DayTimeClose,
			Detail:       post.Detail,
		}

		if err := h.pgDB.Create(&CP).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": post}) //ส่ง BP กลับไปตรงที่ fetch ที่เราเรียกใช้
	}

}

func (h *HandlerFunc) GetAllPost(c *gin.Context) {

	var post []entity.Post

	if err := h.pgDB.Model(&entity.Post{}).Preload("Category").Find(&post).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": post})

}
