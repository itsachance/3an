package main

import (
	"database/sql"
	"net/http"

	"github.com/ItsAchance/3an/internal/models"
)

func Routes(db *sql.DB) *http.ServeMux {
	app := &Application{
		ScoreModel: &models.ScoreModel{
			DB: db,
		},
	}
	mux := http.NewServeMux()

	fileServer := http.FileServer(http.Dir("./ui/static"))
	mux.Handle("GET /static/", http.StripPrefix("/static", fileServer))

	mux.HandleFunc("GET /{$}", app.Home)
	mux.HandleFunc("GET /get-score", app.Highscore)
	mux.HandleFunc("POST /save-score", app.SaveGame)

	return mux
}
