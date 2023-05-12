package controller

import (
	"net/http"

	"github.com/SirivipaSuramanee/entity"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func (h *HandlerFunc) Register(c *gin.Context) {
	var user entity.User

	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)

	us := entity.User{
		FirstName:  user.FirstName,
		LastName:   user.LastName,
		Tel:        user.Tel,
		Email:      user.Email,
		UserName:   user.UserName,
		Password:   string(password),
		ProfileURL: user.ProfileURL,
	}
	if err := h.pgDB.Create(&us).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"msg": "Created"})
}
