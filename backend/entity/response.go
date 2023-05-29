package entity

import "time"

type PostRespone struct {
	ID           uint                   `json:"id"`
	CreateAt     time.Time              `json:"CreatedAt"`
	Topic        string                 `json:"topic"`
	Picture      string                 `json:"picture"` //###############
	DayTimeOpen  time.Time              `json:"dayTimeOpen"`
	DayTimeClose time.Time              `json:"dayTimeClose"`
	Detail       string                 `json:"detail"`
	Category     []CategoryPostResponse `json:"category"`
	User         User                   `json:"user"`
	Lat          string                 `json:"lat"`
	Lng          string                 `json:"lng"`
}

type UserPostResponse struct {
	ID         uint   `json:"id"`
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	UserName   string `json:"userName"`
	ProfileURL string `json:"profileURL"`
}

type CategoryPostResponse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
