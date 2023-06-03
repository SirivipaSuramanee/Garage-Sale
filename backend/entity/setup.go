package entity

import (
	"fmt"

	"github.com/SirivipaSuramanee/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func SetupDatabase(cgf config.Config) *gorm.DB {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Bangkok",
		cgf.PgHost,
		cgf.PgUser,
		cgf.PgPassword,
		cgf.PgDBName,
		cgf.PgPort,
		cgf.PgSSLMode,
	)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Fail connect to database")
	}
	database.AutoMigrate(
		&User{},
		&Category{},
		&Post{},
		&MapPostCategory{},
		&Img{},
	)
	fmt.Print("Connected")

	return database
}
