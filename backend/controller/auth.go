package controller

import (
	"fmt"
	"net/http"

	"github.com/SirivipaSuramanee/entity"
	"github.com/SirivipaSuramanee/service"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)
// func การเข้าสู่ระบบ
func (h *HandlerFunc) Login(c *gin.Context) {
	var login entity.User
	var user entity.User
	// รับ request เข้ามาแล้วทำการ merge เข้ากับตัวแปร login ex. username password
	var err = c.BindJSON(&login)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("login: %v\n", login)

	// ค้นหา user ว่ามีอยู่ใน database ของเราไหม
	tx := h.pgDB.Model(entity.User{}).Where("user_name = ?", login.UserName).First(&user)

	if tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}
	fmt.Printf("user: %v\n", user)
	// เข้ารหัส password ที่รับเข้ามาแล้วทำการเช็คว่า รหัสตรงกันไหม
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(login.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid password"})
		return
	}
	// 	ส่วนประกอบ ใน token ลองเล่นได้ที่ https://jwt.io/
	jwtWrapper := service.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}
	// สร้าง token เพื่อส่งไปให้หน้าบ้านใช้ 
	signedToken, err := jwtWrapper.GenerateToken(user.Email, int(user.ID))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}
	
	tokenResponse := service.LoginResponse{
		Token:      signedToken,
		Email:      user.Email,
		ProfileURL: user.ProfileURL,
	}

	c.JSON(http.StatusOK, gin.H{"data": tokenResponse})
}
