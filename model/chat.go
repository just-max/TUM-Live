package model

import (
	"gorm.io/gorm"
)

type Chat struct {
	gorm.Model
	Approved  bool
	Moderated bool
	UserID    string
	UserName  string
	Message   string
	StreamID  uint
	Admin     bool
	ReplyTo   *uint
	Replies   []Chat `gorm:"foreignkey:ReplyTo"`
	Votes     []User `gorm:"many2many:chat_votes;"`
}
