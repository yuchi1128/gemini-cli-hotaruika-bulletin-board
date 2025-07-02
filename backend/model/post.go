
package model

import "time"

type Post struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	Replies   []Reply   `json:"replies"`
	Likes     int       `json:"likes"`
}

type Reply struct {
	ID        int       `json:"id"`	
	PostID    int       `json:"post_id"`
	Username  string    `json:"username"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

type Like struct {
	ID        int       `json:"id"`
	PostID    int       `json:"post_id"`
	CreatedAt time.Time `json:"created_at"`
}
