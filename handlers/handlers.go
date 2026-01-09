package handlers

import (
	"net/http"
	"text/template"
)


func Home(w http.ResponseWriter, r *http.Request) {
	tmlp := template.Must(template.ParseFiles("./ui/html/index.html"))
	tmlp.Execute(w, nil)
}

func Highscore(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("This is the highscore"))

	// tmlp := template.Must(template.ParseFiles("./ui/html/index.html"))
	// tmlp.Execute(w, nil)
}

