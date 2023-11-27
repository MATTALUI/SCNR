package main

import (
	"encoding/json"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"io/ioutil"
	"os"
	"os/exec"
	"runtime"
	"time"
)

type Project struct {
	Id           string `json:"id"`
	ImagePreview string `json:"imagePreview"`
}

var (
	testImages       []string
	previewSnapshots []string
	isPiLive         bool
)

func init() {
	isPiLive = runtime.GOOS == "linux"
	testImages = []string{
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
	if isPiLive {
		go GeneratePreviews()
	}
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
	projectId := c.Params("projectId")
	currentDir, err := os.Getwd()
	projectPath := fmt.Sprintf("%s/src/static/assets/projects/%s", currentDir, projectId)
	if _, err := os.Stat(projectPath); err != nil && os.IsNotExist(err) {
		// The project does not exist
		c.Status(404)
		c.SendString("")
	}
	files, err := os.ReadDir(projectPath)
	if err != nil {
		return err
	}
	projectImages := make([]string, len(files))
	fmt.Println(projectPath)
	for i, file := range files {
		imgName := fmt.Sprintf("/assets/projects/%s/%s", projectId, file.Name())
		projectImages[i] = imgName
	}

	data, err := json.Marshal(projectImages)
	if err != nil {
		return err
	}
	return c.SendString(string(data))
}

func HandleGetPreview(c *fiber.Ctx) error {
	if len(previewSnapshots) == 0 {
		return c.SendString("")
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

		_, err := exec.Command("raspistill", "--timeout", "690", "-o", outputPath).Output()
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
