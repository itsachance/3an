package main

import (
	"log"
	"net/http"
	"text/template"
)

func home(w http.ResponseWriter, r *http.Request) {
	tmlp := template.Must(template.ParseFiles("./ui/html/index.html"))
	tmlp.Execute(w, nil)
}

func main() {
	mux := http.NewServeMux()
	// fileServer := http.FileServer(http.Dir(".ui/html"))
	// mux.Handle("GET /html/", http.StripPrefix("/html", fileServer))

	mux.HandleFunc("GET /{$}", home)
	log.Printf("%s", "Listening on http://localhost:5500")
	err := http.ListenAndServe(":5500", mux)
	log.Fatal(err)
}
