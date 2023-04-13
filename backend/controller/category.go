package controller

import (
	"net/http"

	"github.com/SirivipaSuramanee/entity"
	"github.com/gin-gonic/gin"
)

func GetAllCategory(c *gin.Context) {

	var category []entity.Catetagory

	if err := entity.DB().Model(&entity.Catetagory{}).Scan(&category).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": category})

}
