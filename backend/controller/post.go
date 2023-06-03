package controller

import (
	"net/http"

	"github.com/SirivipaSuramanee/entity"
	"github.com/gin-gonic/gin"
)

func (h *HandlerFunc) CreatePost() gin.HandlerFunc {
	return func(c *gin.Context) {
		var post entity.PostRequest
		var user entity.User

		if err := c.BindJSON(&post); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if tx := h.pgDB.Where("email = ?", post.Email).First(&user); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "email not found"})
			return
		}

		CP := entity.Post{
			Topic:        post.Topic,
			Price:        post.Price,
			DayTimeOpen:  post.DayTimeOpen,
			DayTimeClose: post.DayTimeClose,
			Detail:       post.Detail,
			User:         user,
			Lat:          post.Lat,
			Lng:          post.Lng,
		}

		if err := h.pgDB.Create(&CP).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		for _, i := range post.Picture {
			img := entity.Img{
				Url:  i,
				Post: CP,
			}
			if err := h.pgDB.Create(&img).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
		}

		for _, i := range post.Category {
			var category entity.Category
			if tx := h.pgDB.Where("id = ?", i.ID).First(&category); tx.RowsAffected == 0 {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Category not found"})
				return
			}

			map_post_category := entity.MapPostCategory{
				Category: category,
				Post:     CP,
			}

			if err := h.pgDB.Create(&map_post_category).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
		}

		c.JSON(http.StatusCreated, "posted")
	}

}

func (h *HandlerFunc) GetAllPost(c *gin.Context) {

	var posts []entity.Post
	var respone []entity.PostRespone
	var imgs []entity.Img
	if err := h.pgDB.Model(&entity.Post{}).Preload("User").Find(&posts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, post := range posts {
		var map_category []entity.MapPostCategory
		var Categories []entity.CategoryPostResponse

		if err := h.pgDB.Model(&entity.MapPostCategory{}).Where("post_id = ?", post.ID).Preload("Category").Find(&map_category).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		for _, category := range map_category {
			Categories = append(Categories, entity.CategoryPostResponse{
				ID:   category.Category.ID,
				Name: category.Category.Name,
			})
		}

		if err := h.pgDB.Model(&entity.Img{}).Where("post_id = ?", post.ID).Find(&imgs).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		
		respone = append(respone, entity.PostRespone{
			ID:           post.ID,
			CreateAt:     post.CreatedAt,
			Topic:        post.Topic,
			Picture:      imgs,
			DayTimeOpen:  post.DayTimeOpen,
			DayTimeClose: post.DayTimeClose,
			Detail:       post.Detail,
			User:         post.User,
			Lat:          post.Lat,
			Lng:          post.Lng,
			Category:     Categories,
		})
	}

	c.JSON(http.StatusOK, gin.H{"data": respone})

}
