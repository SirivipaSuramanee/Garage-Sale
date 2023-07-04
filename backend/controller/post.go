package controller

import (
	"fmt"
	"net/http"
	"time"

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
			DayTimeOpen:  post.DayTimeOpen,
			DayTimeClose: post.DayTimeClose,
			Detail:       post.Detail,
			User:         user,
			Lat:          post.Lat,
			Lng:          post.Lng,
		}
		// สร้างข็อมูล ตาราง post
		if err := h.pgDB.Create(&CP).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// สร้างข็อมูล ตาราง img
		for _, picture := range post.Picture {
			img := entity.Img{
				Url:  picture,
				Post: CP,
			}
			if err := h.pgDB.Create(&img).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
		}
		// สร้างข็อมูล ตาราง MapPostCategory
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
		var respone []entity.PostResponse

		userId, ok := c.Get("userId")
		condition := c.Query("condition")

		startDate := c.Query("startDate")
		endDate := c.Query("endDate")

		var filterDate string
		if endDate != "" && startDate != "" {
			filterDate = fmt.Sprintf("Date('%s') BETWEEN Date(day_time_open) or Date(day_time_close) and Date('%s') BETWEEN Date(day_time_open) and Date(day_time_close)", startDate, endDate)
		} else if startDate != "" {
			now := time.Now()
			date, _ := time.Parse("2006-01-02T15:04:05Z07:00", startDate)
			if now.Format("2006-01-02") == date.Format("2006-01-02") {
				filterDate = fmt.Sprintf("Date('%s') = Date(day_time_open)", startDate)
			} else {
				filterDate = fmt.Sprintf("Date('%s') = Date(day_time_open)", startDate)
			}
		}
		fmt.Printf("filterDate: %v\n", filterDate)
		if ok {
			if condition == "all" {
				if err := h.pgDB.Model(&entity.Post{}).Where(filterDate).Preload("User").Find(&posts).Error; err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
					return
				}
			} else if condition == "myPost" {
				if err := h.pgDB.Model(&entity.Post{}).Where("user_id = ?", userId).Preload("User").Find(&posts).Error; err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
					return
				}
			} else if condition == "notMe" {
				if err := h.pgDB.Model(&entity.Post{}).Where("user_id != ?", userId).Preload("User").Find(&posts).Error; err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
					return
				}
			}

		} else {
			if err := h.pgDB.Model(&entity.Post{}).Where(filterDate).Preload("User").Find(&posts).Error; err != nil {
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

			respone = append(respone, entity.PostResponse{
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

		var respone []entity.PostResponse
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

			respone = append(respone, entity.PostResponse{
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

// delete โพสที่ถูกใจ unlike
func (h *HandlerFunc) DeleteLikeMapPostFavorite() gin.HandlerFunc {
	return func(c *gin.Context) {
		var request entity.MapPostFavoriteRequest
		var mpf entity.MapPostFavorite
		userId, ok := c.Get("userId") // รับ userId มาจาก token

		if !ok { // ถ้าไม่เจอก็แจ้ง error
			c.JSON(http.StatusBadRequest, gin.H{"error": "can't get userId"})
			return
		}
		// merge request body เข้้ากับ request
		if err := c.BindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// ลบโพสต์ที่เราถูกใจด้วย user_id แลพ post_id
		if err := h.pgDB.Where("post_id = ? and user_id = ?", request.PostID, userId).Delete(&mpf).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, mpf)
	}

}

// อัพเดทโพสต์
func (h *HandlerFunc) UpdatePost() gin.HandlerFunc {

	return func(c *gin.Context) {
		var req entity.PostRequest
		var post entity.Post
		// merge ค่าจาก body ที่รับเข้ามา  เข้ากับ req
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// ค้นหาโพสต์ ด้วย id
		if tx := h.pgDB.Where("id = ?", req.ID).First(&post); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "post not found"})
			return
		}
		// update ค่าต่างๆ ที่เราจะอัพเดท
		post.Topic = req.Topic
		post.Detail = req.Detail
		post.Lat = req.Lat
		post.Lng = req.Lng
		post.DayTimeOpen = req.DayTimeOpen
		post.DayTimeClose = req.DayTimeClose
		// update ลง database
		h.pgDB.Save(&post)
		// ลบการ map กับ category ทิ้งเพื่อ ทำการ inset ใหม่
		if err := h.pgDB.Where("post_id = ?", post.ID).Delete(&entity.MapPostCategory{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// insert Category category ใหม่เข้า post
		for _, i := range req.Category {
			var category entity.Category
			if tx := h.pgDB.Where("id = ?", i.ID).First(&category); tx.RowsAffected == 0 {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Category not found"})
				return
			}

			map_post_category := entity.MapPostCategory{
				Category: category,
				Post:     post,
			}

			if err := h.pgDB.Create(&map_post_category).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
		}
		// ถ้ามีรูปส่งมาอัทเดท
		if req.Picture != nil {
			// ลบรูปเก่าออกจาก database
			if err := h.pgDB.Where("post_id = ?", post.ID).Delete(&entity.Img{}).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			// นำรูปใหม่ใส่ database
			for _, i := range req.Picture {
				img := entity.Img{
					Url:  i,
					Post: post,
				}
				if err := h.pgDB.Create(&img).Error; err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
					return
				}
			}
		}

		c.JSON(http.StatusOK, "update")
	}
}

// ลบโฟสต์
func (h *HandlerFunc) DeletePost() gin.HandlerFunc {

	return func(c *gin.Context) {
		// รับ id มาจาก param
		id := c.Param("id")
		// ลบรูปที่เกี๋ยวข้องกับโพสด้วย id
		if err := h.pgDB.Where("post_id = ?", id).Delete(&entity.Img{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// ลบ การ map category ที่ตาราง MapPostCategory
		if err := h.pgDB.Where("post_id = ?", id).Delete(&entity.MapPostCategory{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// ลบการ map Favorite ของหรือลบโพสที่ชอบออกเนื่องจากไม่มีโพสนี้แล้วจิงต้ิงลบทิ้ง
		if err := h.pgDB.Where("post_id = ?", id).Delete(&entity.MapPostFavorite{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// ลบโพสต์ ตาราง post ทิ้ง ด้วย id
		if err := h.pgDB.Where("id = ?", id).Delete(&entity.Post{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, "delete success")
	}
}
