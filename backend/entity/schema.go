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
type Catetagory struct {
	gorm.Model
	Name string `json:"name"`

	Post []Post `gorm:"foreignKey:CatetagoryID"`
}

type Post struct {
	gorm.Model
	Topic         string      `json:"topic"`
	Price         int         `json:"price"`
	Picture       interface{} `json:"picture"` //###############
	DayTime_Open  time.Time   `json:"dayTimeOpen"`
	DayTime_Close time.Time   `json:"dayTimeClose"`
	Detail        string      `json:"detail"`

	CatetagoryID *uint
	Catetagory   Catetagory `gorm:"references:id"`
}
