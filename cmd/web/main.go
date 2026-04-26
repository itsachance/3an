package main

import (
	"log"
	"net/http"

	"github.com/ItsAchance/3an/handlers"
	"github.com/ItsAchance/3an/internal/models"
)

func main() {
	app := &handlers.Application{}
	models.CreateDb()
	mux := http.NewServeMux()

	 fileServer := http.FileServer(http.Dir("./ui/static"))
	 mux.Handle("GET /static/", http.StripPrefix("/static", fileServer))

	 mux.HandleFunc("GET /{$}", app.Home)
	 mux.HandleFunc("GET /get-score",app.Highscore)

	log.Printf("%s", "Listening on http://localhost:5500")
	err := http.ListenAndServe(":5500", mux)
	log.Fatal(err)
}
