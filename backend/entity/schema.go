package entity

import "gorm.io/gorm"

type User struct {
	gorm.Model
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Tel       string `json:"tel"`
	Email     string `gorm:"uniqueIndex" json:"email"`
	UserName  string `gorm:"uniqueIndex" json:"userName"`
	Password  string `json:"password"`
}
