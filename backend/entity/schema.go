package entity

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Tel       string `json:"tel"`
	Email     string `gorm:"uniqueIndex" json:"email"`
	UserName  string `gorm:"uniqueIndex" json:"userName"`
	Password  string `json:"password"`
}
type Category struct {
	gorm.Model
	Name string `json:"name"`

	Post []Post `gorm:"foreignKey:CategoryID"`
}

type Post struct {
	gorm.Model
	Topic        string    `json:"topic"`
	Price        int       `json:"price"`
	Picture      string    `json:"picture"` //###############
	DayTimeOpen  time.Time `json:"dayTimeOpen"`
	DayTimeClose time.Time `json:"dayTimeClose"`
	Detail       string    `json:"detail"`

	CategoryID *uint    `json:"categoryID"`
	Category   Category `gorm:"references:id" json:"category"`
}
