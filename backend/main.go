package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/keniwo/tocket/models"
	"github.com/keniwo/tocket/routes"
)

func main() {
	// Initialize database
	db, err := models.InitDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Create router
	router := gin.Default()

	// Configure CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Serve uploads directory
	// router.Static("/uploads", "./uploads")

	// Serve static files from the frontend build
	router.Static("/assets", "./frontend/dist/assets")
	router.StaticFile("/", "./frontend/dist/index.html")
	router.StaticFile("/favicon.ico", "./frontend/dist/favicon.ico")

	// For any other routes not handled by the API, serve index.html for SPA routing.
	router.NoRoute(func(c *gin.Context) {
		c.File("./frontend/dist/index.html")
	})

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "OK",
		})
	})

	// Setup API routes
	apiGroup := router.Group("/api")
	routes.SetupTicketRoutes(apiGroup, db)

	// Start server
	log.Println("Server starting on port 8080...")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
