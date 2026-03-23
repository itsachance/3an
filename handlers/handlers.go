package handlers

import (
	"net/http"
	"text/template"

	"github.com/ItsAchance/3an/internal/models"
)

type Application struct {
	SnippetModel *models.SnippetModel
}

func (app *Application) Home(w http.ResponseWriter, r *http.Request) {
	tmlp := template.Must(template.ParseFiles("./ui/html/index.html"))
	tmlp.Execute(w, nil)
}

func (app *Application) Highscore(w http.ResponseWriter, r *http.Request) {

	// tmlp := template.Must(template.ParseFiles("./ui/html/index.html"))
	// tmlp.Execute(w, nil)
}
