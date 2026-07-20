package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"text/template"
	"time"

	"github.com/ItsAchance/3an/internal/models"
)

type Application struct {
	DBModel *models.DBModel
}

type Data struct {
	ID      int       `json:"id,omitempty"`
	Name    string    `json:"name,omitempty"`
	Score   int       `json:"score,omitempty"`
	Created time.Time `json:"created"`
}

type GameStats struct {
	GameStats map[string]Data `json:"gameStats,omitempty"`
}

func (app *Application) Home(w http.ResponseWriter, r *http.Request) {
	tmlp := template.Must(template.ParseFiles("./ui/html/index.html"))
	tmlp.Execute(w, nil)
}

func (app *Application) Highscore(w http.ResponseWriter, r *http.Request) {
	name, score, err := app.DBModel.GetHighscore()
	if err != nil {
		log.Printf("GetHighscore error: %v", err)
		http.Error(w, "no highscore yet", http.StatusNotFound)
		return
	}
	data := &Data{
		Name:  name,
		Score: score,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (app *Application) SaveGame(w http.ResponseWriter, r *http.Request) {
	saveScore := &GameStats{}
	respByte, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Printf("Error: %v", err)
	}
	err = json.Unmarshal(respByte, &saveScore)
	if err != nil {
		fmt.Printf("Error unmarshaling: %v", err)
	}
	for _, playerStats := range saveScore.GameStats {
		// fmt.Printf("Player: %s, Score: %d\n", strings.TrimPrefix(playerStats.Name, "* "), playerStats.Score)
		cleanName := strings.TrimPrefix(playerStats.Name, "* ")
		updatedScore := &models.Score{
			Name:  cleanName,
			Score: playerStats.Score,
		}
		err = app.DBModel.SaveScore(updatedScore)
		if err != nil {
			fmt.Printf("error when saving score: %v", err)
		}

		// fmt.Printf("playerStats: %+v\n", playerStats)
		// playerStats: {ID:0 Name:baz Score:123 Created:0001-01-01 00:00:00 +0000 UTC}
	}
}
