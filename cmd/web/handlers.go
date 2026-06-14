package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"text/template"
	"time"

	"github.com/ItsAchance/3an/internal/models"
)

type Application struct {
	ScoreModel *models.ScoreModel
}

type Data struct {
	ID      int       `json:"id,omitempty"`
	Name    string    `json:"name,omitempty"`
	Score   int       `json:"score,omitempty"`
	Created time.Time `json:"created,omitempty"`
}

type GameStats struct {
	GameStats map[string]Data `json:"gameStats,omitempty"`
}

func (app *Application) Home(w http.ResponseWriter, r *http.Request) {
	tmlp := template.Must(template.ParseFiles("./ui/html/index.html"))
	tmlp.Execute(w, nil)
}

func (app *Application) Highscore(w http.ResponseWriter, r *http.Request) {
	name, score := app.ScoreModel.GetHighscore()

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
		fmt.Errorf("Error: %w", err)
	}
	err = json.Unmarshal(respByte, &saveScore)
	if err != nil {
		fmt.Errorf("Error unmarshaling: %w", err)
	}
	for _, playerStats := range saveScore.GameStats {
		fmt.Printf("Player: %s, Score: %d\n", playerStats.Name, playerStats.Score)
	}
	// populate a models.Score object from above codee and pass it in the app.ScoreModel.SaveScore method

	// err = app.ScoreModel.SaveScore(saveScore)
	//
	//	if err != nil {
	//		fmt.Errorf("error when saving score: %w", err)
	//	}
}
