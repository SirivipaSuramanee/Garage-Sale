package entity

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	Tel        string `json:"tel"`
	Email      string `gorm:"uniqueIndex" json:"email"`
	UserName   string `gorm:"uniqueIndex" json:"userName"`
	Password   string `json:"password"`
	ProfileURL string `json:"profileURL"`

	Post []Post `gorm:"foreignKey:UserID"`
}
type Category struct {
	gorm.Model
	Name string `json:"name"`

	MapPostCategory []MapPostCategory `gorm:"foreignKey:CategoryID"`
}

type MapPostCategory struct {
	CategoryID *uint    `json:"categoryID"`
	Category   Category `gorm:"references:id" json:"category"`

	PostID *uint `json:"PostID"`
	Post   Post  `gorm:"references:id" json:"post"`
}

type Post struct {
	gorm.Model
	Topic        string    `json:"topic"`
	Price        int       `json:"price"`
	Picture      string    `json:"picture"` //###############
	DayTimeOpen  time.Time `json:"dayTimeOpen"`
	DayTimeClose time.Time `json:"dayTimeClose"`
	Detail       string    `json:"detail"`
	Lat          string    `json:"lat"`
	Lng          string    `json:"lng"`

	UserID *uint `json:"userID"`
	User   User  `gorm:"references:id" json:"user"`

	MapPostCategory []MapPostCategory `gorm:"foreignKey:PostID"`
}
