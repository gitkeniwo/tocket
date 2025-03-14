package models

import (
	"strings"
	"time"

	"gorm.io/gorm"
)

// Ticket represents a saved ticket in the application
type Ticket struct {
	gorm.Model
	Title       string    `json:"title"`
	Description string    `json:"description"`
	EventTime   time.Time `json:"eventTime"`
	Location    string    `json:"location"`
	ImagePath   string    `json:"imagePath"`
	Tags        string    `json:"tags"` // Comma-separated tags
}

// TicketResponse is a struct for API responses
type TicketResponse struct {
	ID          uint      `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	EventTime   time.Time `json:"eventTime"`
	Location    string    `json:"location"`
	ImagePath   string    `json:"imagePath"`
	Tags        []string  `json:"tags"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// ToResponse converts a Ticket to a TicketResponse
func (t *Ticket) ToResponse() TicketResponse {
	var tags []string
	if t.Tags != "" {
		tags = splitTags(t.Tags)
	} else {
		tags = []string{}
	}

	return TicketResponse{
		ID:          t.Model.ID,
		Title:       t.Title,
		Description: t.Description,
		EventTime:   t.EventTime,
		Location:    t.Location,
		ImagePath:   t.ImagePath,
		Tags:        tags,
		CreatedAt:   t.Model.CreatedAt,
		UpdatedAt:   t.Model.UpdatedAt,
	}
}

// Helper function to split tags string into slice
func splitTags(tagsStr string) []string {
	return strings.Split(tagsStr, ",")
}
