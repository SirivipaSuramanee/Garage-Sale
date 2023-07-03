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

// อัพโหลดรูปภาพ 1 รูปใช้ตรงหน้า registor
func (h *HandlerFunc) UploadPicture() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		img, err := ctx.FormFile("img") // get รูปภาพจาก fromData key เป็น img
		if err != nil {
			ctx.JSON(http.StatusBadRequest, err.Error())
			return
		}
		file, _ := img.Open()                         // เปิดรูปให้อยู่ในรูปแบบ data type สำหรับใช้อัพโหลด
		contentType := img.Header.Get("Content-Type") // รับ Content-Type เช่น json img...

		fileName := time.Now().Format("01-02-2006-15:04") + img.Filename // ตั้งชื่อไฟล์รูป
		// upload รูปไปเก็บที่ miniO โดย ถ้าเก็บสำหรับminiO จะส่งผลลัพกลับมาให้ในตัวแปร result
		result, err := UploadPictureToMiniO(h.minio, ctx, contentType, file, h.cgf.StorageBucketName, fileName)

		if err != nil {
			ctx.JSON(http.StatusBadRequest, err)
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"data": result.Location}) // result.Location คือ url ของรูปภาพที่ miniO ส่งกลับมา
	}
}

func (h *HandlerFunc) UploadPictures() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		lenStr := ctx.Query("len")       // รับมาจาก query param key len คือ จำนวนของรูปที่ส่งมาแต่ค่าที่ได้เป็น string จริงต้องแปลง
		len, err := strconv.Atoi(lenStr) // แปลงจาก string เป็น integer
		userId, _ := ctx.Get("userId")   // เอา userId มาจาก context ได้มาจากการแกะ token แล้ว set ไว้ใน context
		var imgUrl []string              // เก็บ url ของรูป ที่ miniO ส่งกลับมา เป็น array เนื่องจากมีหลายรูป
		for i := 0; i < len; i++ {       // วนรูปทุกๆรูป
			img, _ := ctx.FormFile(fmt.Sprintf("img%d", i+1)) // get รูปภาพจาก fromData key เป็น img
			if err != nil {
				ctx.JSON(http.StatusBadRequest, err.Error())
				return
			}
			file, _ := img.Open()                                                                       // เปิดรูปให้อยู่ในรูปแบบ data type สำหรับใช้อัพโหลด
			contentType := img.Header.Get("Content-Type")                                               // รับ Content-Type เช่น json img...
			fileName := fmt.Sprintf("img%d-%s-%s-%v", i+1, time.Now().GoString(), img.Filename, userId) // ตั้งชื่อไฟล์รูป
			// upload รูปไปเก็บที่ miniO โดย ถ้าเก็บสำหรับminiO จะส่งผลลัพกลับมาให้ในตัวแปร result
			result, err := UploadPictureToMiniO(h.minio, ctx, contentType, file, h.cgf.StorageBucketName, fileName)
			// UploadPictureToMiniO การเอารูปไปเก็บไว้ที่ miniO
			if err != nil {
				ctx.JSON(http.StatusBadRequest, err)
				return
			}
			// result.Location = url ของรูป
			imgUrl = append(imgUrl, result.Location) // นำรูปไปใส่ใน array imgUrl
		}
		// ส่ง url ของรูปทั้งหมด ที่เก็บอยู่ใน imgUrl กลับไปให้
		ctx.JSON(http.StatusOK, gin.H{"data": imgUrl})
	}
}

func UploadPictureToMiniO(minioClient *minio.Client, ctx *gin.Context, contentType string, file multipart.File, BucketName string, Filename string) (minioResult minio.UploadInfo, err error) {
	userMetaData := map[string]string{"x-amz-acl": "public-read"}

	return minioClient.PutObject(ctx.Request.Context(),
		BucketName, // ชื่อ Bucket คล้ายชื่อโฟลเดอร์ที่เก็บรูป
		Filename,   // ชื่อ ไฟล์
		file, -1,
		minio.PutObjectOptions{ // พวกข้อมูลรายละเอียด
			ContentType:  contentType,
			UserMetadata: userMetaData,
		},
	)
}
