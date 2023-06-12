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

func (h *HandlerFunc) GetAllPost() gin.HandlerFunc {

	return func(c *gin.Context) {
		var posts []entity.Post
		var respone []entity.PostRespone

		userId, ok := c.Get("userId")
		if ok {
			condition := c.Query("condition")
			if condition == "all" {
				if err := h.pgDB.Model(&entity.Post{}).Preload("User").Find(&posts).Error; err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
					return
				}
			} else if condition == "myPost" {
				if err := h.pgDB.Model(&entity.Post{}).Where("user_id = ?", userId).Preload("User").Find(&posts).Error; err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
					return
				}
			}

		} else {
			if err := h.pgDB.Model(&entity.Post{}).Preload("User").Find(&posts).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
		}

		for _, post := range posts {
			var map_category []entity.MapPostCategory
			var Categories []entity.CategoryPostResponse
			var imgs []entity.Img

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
			var mpf entity.MapPostFavorite
			like := false

			if err := h.pgDB.Model(&entity.MapPostFavorite{}).Where("post_id = ? and user_id = ?", post.ID, userId).First(&mpf); err.RowsAffected != 0 {
				like = true
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
				Like:         like,
			})
		}

		c.JSON(http.StatusOK, gin.H{"data": respone})
	}
}

func (h *HandlerFunc) GetAllFavorite() gin.HandlerFunc {

	return func(c *gin.Context) {

		var respone []entity.PostRespone
		var mapPostFavorite []entity.MapPostFavorite
		userId, _ := c.Get("userId")

		if err := h.pgDB.Model(entity.MapPostFavorite{}).Where("user_id = ?", userId).Preload("Post").Preload("Post.User").Find(&mapPostFavorite).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		for _, i := range mapPostFavorite {
			post := i.Post
			var map_category []entity.MapPostCategory
			var Categories []entity.CategoryPostResponse
			var imgs []entity.Img

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
				Like:         true,
			})
		}

		c.JSON(http.StatusOK, gin.H{"data": respone})
	}
}

func (h *HandlerFunc) CreateMapPostFavorite() gin.HandlerFunc {
	return func(c *gin.Context) {
		var request entity.MapPostFavoriteRequest
		var post entity.Post
		var user entity.User

		userId, ok := c.Get("userId")

		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "can't get userId"})
			return
		}

		if err := c.BindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := h.pgDB.Model(entity.Post{}).Where("id = ?", request.PostID).First(&post); err.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "post id not found"})
			return
		}

		if err := h.pgDB.Model(entity.User{}).Where("id = ?", userId).First(&user); err.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "user id not found"})
			return
		}
		mpf := entity.MapPostFavorite{
			Post: post,
			User: user,
		}
		if err := h.pgDB.Create(&mpf).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, "like posted")
	}

}

func (h *HandlerFunc) DeleteLikeMapPostFavorite() gin.HandlerFunc {
	return func(c *gin.Context) {
		var request entity.MapPostFavoriteRequest
		var mpf entity.MapPostFavorite
		userId, ok := c.Get("userId")

		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "can't get userId"})
			return
		}
		if err := c.BindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := h.pgDB.Where("post_id = ? and user_id = ?", request.PostID, userId).Delete(&mpf).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, mpf)
	}

}

func (h *HandlerFunc) DeletePost() gin.HandlerFunc {

	return func(c *gin.Context) {
		id := c.Param("id")

		if err := h.pgDB.Where("post_id = ?", id).Delete(&entity.Img{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := h.pgDB.Where("post_id = ?", id).Delete(&entity.MapPostCategory{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := h.pgDB.Where("post_id = ?", id).Delete(&entity.MapPostFavorite{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := h.pgDB.Where("id = ?", id).Delete(&entity.Post{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, "delete success")
	}
}
