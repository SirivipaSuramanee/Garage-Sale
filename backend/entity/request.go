package entity

import (
	"time"

	"gorm.io/gorm"
)

type PostRequest struct {
	gorm.Model
	Topic        string            `json:"topic"`
	Picture      []string          `json:"picture"`
	DayTimeOpen  time.Time         `json:"dayTimeOpen"`
	DayTimeClose time.Time         `json:"dayTimeClose"`
	Detail       string            `json:"detail"`
	Email        string            `json:"email"`
	Category     []CategoryRequest `json:"category"`
	Lat          string            `json:"lat"`
	Lng          string            `json:"lng"`
}

type CategoryRequest struct {
	gorm.Model
	Name string `json:"name"`
}

type MapPostFavoriteRequest struct {
	PostID int `json:"postId"`
}
