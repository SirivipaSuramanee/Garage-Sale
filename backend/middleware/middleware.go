package middleware

import (
	"strings"

	"github.com/SirivipaSuramanee/service"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT,DELETE,PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		clientToken := c.Request.Header.Get("Authorization")
		if clientToken != "" {
			extractedToken := strings.Split(clientToken, "Bearer ")

			if len(extractedToken) == 2 {
				clientToken = strings.TrimSpace(extractedToken[1])
				claims := service.GetClaims(clientToken)
				c.Set("userId", claims.Id)
			}
		}

		c.Next()
	}
}
