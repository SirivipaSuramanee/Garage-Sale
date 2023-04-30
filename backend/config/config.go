package config

import (
	"context"
	"fmt"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/spf13/viper"
)

var AppConfig Config

type Config struct {
	BucketURL         string `mapstructure:"BUCKET_URL"`
	StorageEndpoint   string `mapstructure:"STORAGE_ENDPOINT"`
	StorageUser       string `mapstructure:"STORAGE_USER"`
	StoragePassword   string `mapstructure:"STORAGE_PASSWORD"`
	StorageBucketName string `mapstructure:"STORAGE_BUCKET_NAME"`
	StorageSSL        bool   `mapstructure:"USE_SSL"`
	PgHost            string `mapstructure:"PG_HOST"`
	PgUser            string `mapstructure:"PG_USER"`
	PgPassword        string `mapstructure:"PG_PASSWORD"`
	PgDBName          string `mapstructure:"PG_DBNAME"`
	PgPort            string `mapstructure:"PG_PORT"`
	PgSSLMode         string `mapstructure:"PG_SSLMODE"`
}

func LoadConFig(path string) (config Config) {
	viper.SetDefault("BUCKET_URL", "http://localhost:9000/")
	viper.SetDefault("STORAGE_ENDPOINT", "localhost:9000")
	viper.SetDefault("STORAGE_USER", "miniouser")
	viper.SetDefault("STORAGE_PASSWORD", "Pa22W0rd")
	viper.SetDefault("STORAGE_BUCKET_NAME", "images")
	viper.SetDefault("USE_SSL", false)
	viper.SetDefault("PG_HOST", "localhost")
	viper.SetDefault("PG_USER", "postgres")
	viper.SetDefault("PG_PASSWORD", "postgres")
	viper.SetDefault("PG_DBNAME", "postgres")
	viper.SetDefault("PG_PORT", "5432")
	viper.SetDefault("PG_SSLMODE", "disable")

	viper.AddConfigPath(path)
	viper.SetConfigName("app")
	viper.SetConfigType("env")
	viper.AutomaticEnv()
	viper.ReadInConfig()
	viper.Unmarshal(&config)
	AppConfig = config

	return AppConfig
}

func ConnectMiniO(cgf Config, ctx context.Context) (*minio.Client, error) {
	minioClient, err := minio.New(cgf.StorageEndpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cgf.StorageUser, cgf.StoragePassword, ""),
		Secure: cgf.StorageSSL,
	})
	errB := CreateMakeBucket(ctx, cgf, minioClient)

	if errB != nil {
		fmt.Printf("errB: %v\n", errB)
	}
	return minioClient, err
}

// Create a bucket at region 'us-east-1' with object locking enabled.
func CreateMakeBucket(ctx context.Context, cgf Config, minioClient *minio.Client) (err error) {
	return minioClient.MakeBucket(ctx, cgf.StorageBucketName, minio.MakeBucketOptions{Region: "us-east-1", ObjectLocking: true})
}
