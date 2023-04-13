package entity

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SetupDatabase() {
	dsn := "host=localhost user=postgres password=postgres dbname=postgres port=5432 sslmode=disable TimeZone=Asia/Bangkok"
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Fail connect to database")
	}
	database.AutoMigrate(
		&User{},
		&Catetagory{},
		&Post{},
	)

	db = database
	fmt.Print("Connected")

	//-------------Catetagory---------------
	category1 := Catetagory{
		Name: "เครื่องดนตรี",
	}
	db.Model(&Catetagory{}).Create(&category1)

	category2 := Catetagory{
		Name: "แม่และเด็ก",
	}
	db.Model(&Catetagory{}).Create(&category2)

	category3 := Catetagory{
		Name: "เครื่องใช้ไฟฟ้า",
	}
	db.Model(&Catetagory{}).Create(&category3)

	category4 := Catetagory{
		Name: "คอมพิวเตอร์",
	}
	db.Model(&Catetagory{}).Create(&category4)

	category5 := Catetagory{
		Name: "รองเท้า",
	}
	db.Model(&Catetagory{}).Create(&category5)

}
