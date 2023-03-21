package controller

import (
	"fmt"
	"net/http"

	"github.com/SirivipaSuramanee/entity"
	"github.com/SirivipaSuramanee/service"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Login(c *gin.Context) {
	var login entity.User
	var user entity.User

	var err = c.BindJSON(&login)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("login: %v\n", login)
	tx := entity.DB().Model(entity.User{}).Where("user_name = ?", login.UserName).First(&user)

	if tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}
	fmt.Printf("user: %v\n", user)

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(login.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid password"})
		return
	}

	jwtWrapper := service.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(user.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}

	tokenResponse := service.LoginResponse{
		Token: signedToken,
		Email: user.Email,
	}

	c.JSON(http.StatusOK, gin.H{"data": tokenResponse})
}
