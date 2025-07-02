
package repository

import (
	"database/sql"
	"hotaruika/backend/model"
)

type PostRepository struct {
	DB *sql.DB
}

func (r *PostRepository) GetPosts() ([]model.Post, error) {
	rows, err := r.DB.Query("SELECT id, username, content, created_at FROM posts ORDER BY created_at DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []model.Post
	for rows.Next() {
		var p model.Post
		if err := rows.Scan(&p.ID, &p.Username, &p.Content, &p.CreatedAt); err != nil {
			return nil, err
		}

		// Get replies for each post
		replyRows, err := r.DB.Query("SELECT id, post_id, username, content, created_at FROM replies WHERE post_id = $1 ORDER BY created_at ASC", p.ID)
		if err != nil {
			return nil, err
		}
		defer replyRows.Close()

		var replies []model.Reply
		for replyRows.Next() {
			var reply model.Reply
			if err := replyRows.Scan(&reply.ID, &reply.PostID, &reply.Username, &reply.Content, &reply.CreatedAt); err != nil {
				return nil, err
			}
			replies = append(replies, reply)
		}
		p.Replies = replies

		// Get likes count for each post
		var likesCount int
		err = r.DB.QueryRow("SELECT COUNT(*) FROM likes WHERE post_id = $1", p.ID).Scan(&likesCount)
		if err != nil {
			return nil, err
		}
		p.Likes = likesCount

		posts = append(posts, p)
	}

	return posts, nil
}

func (r *PostRepository) CreatePost(post model.Post) (model.Post, error) {
	stmt, err := r.DB.Prepare("INSERT INTO posts (username, content) VALUES ($1, $2) RETURNING id, created_at")
	if err != nil {
		return model.Post{}, err
	}
	defer stmt.Close()

	err = stmt.QueryRow(post.Username, post.Content).Scan(&post.ID, &post.CreatedAt)
	if err != nil {
		return model.Post{}, err
	}

	return post, nil
}

func (r *PostRepository) CreateReply(reply model.Reply) (model.Reply, error) {
	stmt, err := r.DB.Prepare("INSERT INTO replies (post_id, username, content) VALUES ($1, $2, $3) RETURNING id, created_at")
	if err != nil {
		return model.Reply{}, err
	}
	defer stmt.Close()

	err = stmt.QueryRow(reply.PostID, reply.Username, reply.Content).Scan(&reply.ID, &reply.CreatedAt)
	if err != nil {
		return model.Reply{}, err
	}

	return reply, nil
}

func (r *PostRepository) LikePost(postID int) error {
	// Check if already liked
	var count int
	err := r.DB.QueryRow("SELECT COUNT(*) FROM likes WHERE post_id = $1", postID).Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		return nil // Already liked, do nothing
	}

	_, err = r.DB.Exec("INSERT INTO likes (post_id) VALUES ($1)", postID)
	return err
}
