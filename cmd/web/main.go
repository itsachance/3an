package main

import (
	"log"
	"net/http"
	"github.com/ItsAchance/3an/handlers"
)

func main() {
	mux := http.NewServeMux()
	// fileServer := http.FileServer(http.Dir(".ui/html"))
	// mux.Handle("GET /html/", http.StripPrefix("/html", fileServer))

	mux.HandleFunc("GET /{$}", handlers.Home)
	mux.HandleFunc("GET /get-score", handlers.Highscore)

	log.Printf("%s", "Listening on http://localhost:5500")
	err := http.ListenAndServe(":5500", mux)
	log.Fatal(err)
}
