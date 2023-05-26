package entity

import (
	"time"

	"gorm.io/gorm"
)

type PostRequest struct {
	gorm.Model
	Topic        string    `json:"topic"`
	Price        int       `json:"price"`
	Picture      string    `json:"picture"`
	DayTimeOpen  time.Time `json:"dayTimeOpen"`
	DayTimeClose time.Time `json:"dayTimeClose"`
	Detail       string    `json:"detail"`
	Email        string    `json:"email"`
	CategoryID   *uint     `json:"categoryID"`
	Lat          string    `json:"lat"`
	Lng          string    `json:"lng"`
}
