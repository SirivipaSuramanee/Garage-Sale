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
	//เข้ารหัส password เช้าเราใส่มา 12345678 ใน database จะถูกเก็บ smdkfmkngkafgnvawrjgnfmk
	password, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	// สร้างข้อมูลสำหรับการลงทะเบียน
	us := entity.User{
		FirstName:  user.FirstName,
		LastName:   user.LastName,
		Tel:        user.Tel,
		Email:      user.Email,
		UserName:   user.UserName,
		Password:   string(password),
		ProfileURL: user.ProfileURL,
	}
	// insert ข้อมูลลง postgres
	if err := h.pgDB.Create(&us).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"msg": "Created"})
}
