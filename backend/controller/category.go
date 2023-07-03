package controller

import (
	"net/http"

	"github.com/SirivipaSuramanee/entity"
	"github.com/gin-gonic/gin"
)

// ค้นหา Category ทั้งหมดที่มีใน database
func (h *HandlerFunc) GetAllCategory(c *gin.Context) {

	var category []entity.Category

	if err := h.pgDB.Model(entity.Category{}).Scan(&category).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": category})

}
