package main

import (
	"encoding/json"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"io/ioutil"
	"time"
)

type Project struct {
	Id           string `json:"id"`
	ImagePreview string `json:"imagePreview"`
}

var (
	images       []string
	previewIndex int
)

func init() {
	previewIndex = 0
	images = []string{
		"/assets/projects/test/0.jpg",
		"/assets/projects/test/1.jpg",
		"/assets/projects/test/2.jpg",
		"/assets/projects/test/3.jpg",
		"/assets/projects/test/4.jpg",
		"/assets/projects/test/5.jpg",
		"/assets/projects/test/6.jpg",
		"/assets/projects/test/7.jpg",
	}
}

func main() {
	app := fiber.New()
	go GeneratePreviews()
	app.Static("/", "./src/static") // relative tot he root of the project
	app.Get("/api/projects/", HandleGetProjects)
	app.Get("/api/projects/:projectId/images", HandleGetProjectImages)
	app.Get("/api/preview", HandleGetPreview)
	app.Listen(":1337")
}

func HandleGetProjects(c *fiber.Ctx) error {
	projects := make([]Project, 0)
	files, err := ioutil.ReadDir("./src/static/assets/projects")
	if err != nil {
		return err
	}
	for _, file := range files {
		fileName := file.Name()
		imagePreview := fmt.Sprintf("/assets/projects/%s/0.jpg", fileName)
		projects = append(projects, Project{
			Id:           fileName,
			ImagePreview: imagePreview,
		})
	}
	data, err := json.Marshal(projects)
	if err != nil {
		return err
	}
	return c.SendString(string(data))
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
