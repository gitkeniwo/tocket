package models

import (
	"github.com/glebarez/sqlite" // Uses modernc.org/sqlite under the hood (no CGO)
	"gorm.io/gorm"
)

// DB is a global variable to hold the database connection
var DB *gorm.DB

// InitDB initializes the database connection
func InitDB() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open("tocket.db"), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Auto migrate the schemas
	if err := db.AutoMigrate(&Ticket{}); err != nil {
		return nil, err
	}

	DB = db
	return db, nil
}
