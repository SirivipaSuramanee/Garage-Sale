package controller

import (
	"context"
	"fmt"
	"mime/multipart"
	"net/http"

	"github.com/SirivipaSuramanee/config"
	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

func NewHandlerFunc(cgf *config.Config) HandlerFunc {
	return HandlerFunc{
		cgf: cgf,
	}
}

func ConnectMiniO(cgf config.Config, ctx context.Context) (*minio.Client, error) {
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
func CreateMakeBucket(ctx context.Context, cgf config.Config, minioClient *minio.Client) (err error) {
	return minioClient.MakeBucket(ctx, cgf.StorageBucketName, minio.MakeBucketOptions{Region: "us-east-1", ObjectLocking: true})
}

type HandlerFunc struct {
	cgf *config.Config
}

func (h *HandlerFunc) UploadPicture(minioClient *minio.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {

		img, err := ctx.FormFile("img")
		if err != nil {
			ctx.JSON(http.StatusBadRequest, err.Error())
			return
		}
		file, _ := img.Open()
		contentType := img.Header.Get("Content-Type")

		result, err := UploadPictureRopository(minioClient, ctx, contentType, file, h.cgf.StorageBucketName, img.Filename)

		if err != nil {
			ctx.JSON(http.StatusBadRequest, err)
			return
		}

		ctx.JSON(http.StatusOK, result.Location)
	}
}

func UploadPictureRopository(minioClient *minio.Client, ctx *gin.Context, contentType string, file multipart.File, BucketName string, Filename string) (minioResult minio.UploadInfo, err error) {
	userMetaData := map[string]string{"x-amz-acl": "public-read"}

	return minioClient.PutObject(ctx.Request.Context(),
		BucketName,
		Filename,
		file, -1,
		minio.PutObjectOptions{
			ContentType:  contentType,
			UserMetadata: userMetaData,
		},
	)
}
