
package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"hotaruika/backend/repository"
)

type ForecastHandler struct {
	DB *sql.DB
}

func (h *ForecastHandler) GetForecasts(w http.ResponseWriter, r *http.Request) {
	repo := repository.ForecastRepository{DB: h.DB}
	forecasts, err := repo.GetForecasts()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(forecasts)
}
