package config

import "github.com/spf13/viper"

var AppConfig Config

type Config struct {
	BucketURL         string `mapstructure:"BUCKET_URL"`
	StorageEndpoint   string `mapstructure:"STORAGE_ENDPOINT"`
	StorageUser       string `mapstructure:"STORAGE_USER"`
	StoragePassword   string `mapstructure:"STORAGE_PASSWORD"`
	StorageBucketName string `mapstructure:"STORAGE_BUCKET_NAME"`
	StorageSSL        bool   `mapstructure:"USE_SSL"`
}

func LoadConFig(path string) (config Config) {
	viper.SetDefault("BUCKET_URL", "http://localhost:9000/")
	viper.SetDefault("STORAGE_ENDPOINT", "localhost:9000")
	viper.SetDefault("STORAGE_USER", "miniouser")
	viper.SetDefault("STORAGE_PASSWORD", "Pa22W0rd")
	viper.SetDefault("STORAGE_BUCKET_NAME", "images")
	viper.SetDefault("USE_SSL", false)

	viper.AddConfigPath(path)
	viper.SetConfigName("app")
	viper.SetConfigType("env")
	viper.AutomaticEnv()
	viper.ReadInConfig()
	viper.Unmarshal(&config)
	AppConfig = config

	return AppConfig
}
