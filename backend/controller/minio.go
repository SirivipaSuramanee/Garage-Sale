package controller

import (
	"fmt"
	"mime/multipart"
	"net/http"
	"strconv"
	"time"

	"github.com/SirivipaSuramanee/config"
	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
	"gorm.io/gorm"
)

func NewHandlerFunc(cgf *config.Config, pgDB *gorm.DB, minio *minio.Client) HandlerFunc {

	return HandlerFunc{
		cgf:   cgf,
		pgDB:  pgDB,
		minio: minio,
	}
}

type HandlerFunc struct {
	cgf   *config.Config
	pgDB  *gorm.DB
	minio *minio.Client
}

func (h *HandlerFunc) UploadPicture() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		img, err := ctx.FormFile("img")
		if err != nil {
			ctx.JSON(http.StatusBadRequest, err.Error())
			return
		}
		file, _ := img.Open()
		contentType := img.Header.Get("Content-Type")

		fileName := time.Now().Format("01-02-2006-15:04") + img.Filename

		result, err := UploadPictureRopository(h.minio, ctx, contentType, file, h.cgf.StorageBucketName, fileName)

		if err != nil {
			ctx.JSON(http.StatusBadRequest, err)
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"data": result.Location})
	}
}

func (h *HandlerFunc) UploadPictures() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		lenStr := ctx.Query("len")
		len, err := strconv.Atoi(lenStr)
		userId, _ := ctx.Get("userId")
		var imgUrl []string
		for i := 0; i < len; i++ {
			img, _ := ctx.FormFile(fmt.Sprintf("img%d", i+1))
			if err != nil {
				ctx.JSON(http.StatusBadRequest, err.Error())
				return
			}
			file, _ := img.Open()
			contentType := img.Header.Get("Content-Type")
			fileName := fmt.Sprintf("img%d-%s-%s-%v", i+1, time.Now().GoString(), img.Filename, userId)
			result, err := UploadPictureRopository(h.minio, ctx, contentType, file, h.cgf.StorageBucketName, fileName)
			imgUrl = append(imgUrl, result.Location)
			if err != nil {
				ctx.JSON(http.StatusBadRequest, err)
				return
			}
		}
		
		ctx.JSON(http.StatusOK, gin.H{"data": imgUrl})
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
