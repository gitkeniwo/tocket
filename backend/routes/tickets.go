package routes

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/keniwo/tocket/models"
	"gorm.io/gorm"
)

// SetupTicketRoutes sets up the routes for ticket operations
func SetupTicketRoutes(router *gin.RouterGroup, db *gorm.DB) {
	ticketsGroup := router.Group("/tickets")
	{
		ticketsGroup.GET("", getTickets(db))
		ticketsGroup.GET("/:id", getTicket(db))
		ticketsGroup.POST("", createTicket(db))
		ticketsGroup.PUT("/:id", updateTicket(db))
		ticketsGroup.DELETE("/:id", deleteTicket(db))
		ticketsGroup.POST("/upload", uploadImage())
	}
}

// getTickets returns all tickets
func getTickets(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var tickets []models.Ticket
		if err := db.Find(&tickets).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tickets"})
			return
		}

		// Convert tickets to response format
		response := make([]models.TicketResponse, len(tickets))
		for i, ticket := range tickets {
			response[i] = ticket.ToResponse()
		}

		c.JSON(http.StatusOK, response)
	}
}

// getTicket returns a single ticket by ID
func getTicket(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var ticket models.Ticket

		if err := db.First(&ticket, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Ticket not found"})
			return
		}

		c.JSON(http.StatusOK, ticket.ToResponse())
	}
}

// createTicket creates a new ticket
func createTicket(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var ticket models.Ticket
		if err := c.ShouldBindJSON(&ticket); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := db.Create(&ticket).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create ticket"})
			return
		}

		c.JSON(http.StatusCreated, ticket.ToResponse())
	}
}

// updateTicket updates an existing ticket
func updateTicket(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var ticket models.Ticket

		// Check if ticket exists
		if err := db.First(&ticket, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Ticket not found"})
			return
		}

		// Bind updated data
		if err := c.ShouldBindJSON(&ticket); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Save changes
		if err := db.Save(&ticket).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update ticket"})
			return
		}

		c.JSON(http.StatusOK, ticket.ToResponse())
	}
}

// deleteTicket deletes a ticket by ID
func deleteTicket(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var ticket models.Ticket

		// Check if ticket exists
		if err := db.First(&ticket, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Ticket not found"})
			return
		}

		// Delete ticket
		if err := db.Delete(&ticket).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete ticket"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Ticket deleted successfully"})
	}
}

// uploadImage handles image uploads
func uploadImage() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Create uploads directory if it doesn't exist
		uploadsDir := "./uploads"
		if err := os.MkdirAll(uploadsDir, os.ModePerm); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create uploads directory"})
			return
		}

		// Get file from request
		file, err := c.FormFile("image")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No image provided"})
			return
		}

		// Generate unique filename
		filename := fmt.Sprintf("%d_%s", time.Now().Unix(), file.Filename)
		filepath := filepath.Join(uploadsDir, filename)

		// Save the file
		if err := c.SaveUploadedFile(file, filepath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}

		// Return the image path
		c.JSON(http.StatusOK, gin.H{
			"imagePath": "/uploads/" + filename,
		})
	}
}
