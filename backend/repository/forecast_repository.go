
package repository

import (
	"database/sql"

	"hotaruika/backend/model"
)

type ForecastRepository struct {
	DB *sql.DB
}

func (r *ForecastRepository) GetForecasts() ([]model.Forecast, error) {
	rows, err := r.DB.Query("SELECT id, date, location, prediction, created_at FROM forecasts ORDER BY date ASC LIMIT 7")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var forecasts []model.Forecast
	for rows.Next() {
		var f model.Forecast
		if err := rows.Scan(&f.ID, &f.Date, &f.Location, &f.Prediction, &f.CreatedAt); err != nil {
			return nil, err
		}
		forecasts = append(forecasts, f)
	}

	return forecasts, nil
}
