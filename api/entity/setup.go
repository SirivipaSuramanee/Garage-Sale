package entity

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func SetupDatabase() {
	dsn := "host=localhost user=postgres password=postgres dbname=postgres port=5432 sslmode=disable TimeZone=Asia/Bangkok"
	_, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Fail connect to database")
	}
	fmt.Print("Connected")

}
