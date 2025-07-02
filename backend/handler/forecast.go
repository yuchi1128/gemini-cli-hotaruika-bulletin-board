
package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"hotaruika/backend/model"
)

type ForecastHandler struct {
	DB *sql.DB
}

func (h *ForecastHandler) GetForecasts(w http.ResponseWriter, r *http.Request) {
	forecasts := []model.Forecast{
		{ID: 1, Date: time.Now(), Location: "富山湾", Prediction: "プチ湧き"},
		{ID: 2, Date: time.Now().AddDate(0, 0, 1), Location: "富山湾", Prediction: "チョイ湧き"},
		{ID: 3, Date: time.Now().AddDate(0, 0, 2), Location: "富山湾", Prediction: "湧き"},
		{ID: 4, Date: time.Now().AddDate(0, 0, 3), Location: "富山湾", Prediction: "爆湧き"},
		{ID: 5, Date: time.Now().AddDate(0, 0, 4), Location: "富山湾", Prediction: "なし"},
		{ID: 6, Date: time.Now().AddDate(0, 0, 5), Location: "富山湾", Prediction: "プチ湧き"},
		{ID: 7, Date: time.Now().AddDate(0, 0, 6), Location: "富山湾", Prediction: "チョイ湧き"},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(forecasts)
}
