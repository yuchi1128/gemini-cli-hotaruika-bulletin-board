
package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"hotaruika/backend/handler"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

func main() {
	connStr := "host=db port=5432 user=user password=password dbname=hotaruika_db sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Successfully connected to database!")

	r := mux.NewRouter()

	forecastHandler := &handler.ForecastHandler{DB: db}
	r.HandleFunc("/api/forecasts", forecastHandler.GetForecasts).Methods("GET")

	postHandler := &handler.PostHandler{DB: db}
	r.HandleFunc("/api/posts", postHandler.GetPosts).Methods("GET")
	r.HandleFunc("/api/posts", postHandler.CreatePost).Methods("POST")
	r.HandleFunc("/api/posts/{id}/replies", postHandler.CreateReply).Methods("POST")
	r.HandleFunc("/api/posts/{id}/like", postHandler.LikePost).Methods("POST")

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
