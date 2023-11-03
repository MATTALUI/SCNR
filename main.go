package main

import (
	"encoding/json"
	"github.com/gofiber/fiber/v2"
	"time"
)

var (
	images       []string
	previewIndex int
)

func init() {
	previewIndex = 0
	images = []string{
		"/assets/test/0.jpg",
		"/assets/test/1.jpg",
		"/assets/test/2.jpg",
		"/assets/test/3.jpg",
		"/assets/test/4.jpg",
		"/assets/test/5.jpg",
		"/assets/test/6.jpg",
		"/assets/test/7.jpg",
	}
}

func main() {
	app := fiber.New()
	go GeneratePreviews()
	app.Static("/", "./static")
	app.Get("/api/images/:projectId", HandleGetProjectImages)
	app.Get("/api/preview", HandleGetPreview)
	app.Listen(":1337")
}

func HandleGetProjectImages(c *fiber.Ctx) error {
	data, err := json.Marshal(images)
	if err != nil {
		return err
	}
	return c.SendString(string(data))
}

func HandleGetPreview(c *fiber.Ctx) error {
	return c.SendString(images[previewIndex])
}

func GeneratePreviews() {
	for {
		time.Sleep(time.Duration(200) * time.Millisecond)
		previewIndex++
		if previewIndex == len(images) {
			previewIndex = 0
		}
	}
}
