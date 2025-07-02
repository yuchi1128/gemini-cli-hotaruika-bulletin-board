
package model

import "time"

type Forecast struct {
	ID          int       `json:"id"`
	Date        time.Time `json:"date"`
	Location    string    `json:"location"`
	Prediction  string    `json:"prediction"` // なし, プチ湧き, チョイ湧き, 湧き, 爆湧き
	CreatedAt   time.Time `json:"created_at"`
}
