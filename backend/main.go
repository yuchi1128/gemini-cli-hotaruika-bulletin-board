
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

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
