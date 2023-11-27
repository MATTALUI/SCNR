package main

import (
	"encoding/json"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"io/ioutil"
	"os"
	"os/exec"
	"time"
)

type Project struct {
	Id           string `json:"id"`
	ImagePreview string `json:"imagePreview"`
}

var (
	images           []string
	previewIndex     int
	previewSnapshots []string
)

func init() {
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
	previewSnapshots = make([]string, 0)
}

func main() {
	app := fiber.New()
	go GeneratePreviews()
	app.Static("/", "./src/static") // relative to the root of the project
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
	if len(previewSnapshots) == 0 {
		return c.SendString("/preview-1701031254-5e60e540-4b07-492e-8a2e-60701ef49cb4.jpg")
	}
	return c.SendString(previewSnapshots[0])
}

func GeneratePreviews() {
	// Clear out old previews here
	currentDir, err := os.Getwd()
	//fmt.Println(fmt.Sprintf("%s/src/static/preview-*.jpg", currentDir))
	//_, err = exec.Command("rm", "-f", fmt.Sprintf("%s/src/static/preview-*.jpg", currentDir)).Output()
	if err != nil {
		fmt.Println("Could not clean up the existing previews")
		panic(err)
	}
	for {
		newPreviewName := fmt.Sprintf("/preview-%d-%s.jpg", time.Now().Unix(), uuid.NewString())
		outputPath := fmt.Sprintf("%s/src/static%s", currentDir, newPreviewName)

		_, err := exec.Command("raspistill", "-o", outputPath).Output()
		if err != nil {
			fmt.Println("An error occurred while taking a preview still")
			panic(err)
		}

		newSnapshots := []string{newPreviewName}

		for index, snapshot := range previewSnapshots {
			if index < 3 {
				newSnapshots = append(newSnapshots, snapshot)
			} else {
				go DeleteSnapshot(snapshot)
			}
		}
		previewSnapshots = newSnapshots
		//time.Sleep(time.Duration(300) * time.Millisecond)
	}
}

func DeleteSnapshot(snapshot string) {
	currentDir, err := os.Getwd()
	_, err = exec.Command("rm", fmt.Sprintf("%s/src/static%s", currentDir, snapshot)).Output()
	if err != nil {
		fmt.Printf("Could not delete snapshot: %s\n", snapshot)
		panic(err)
	}
}
