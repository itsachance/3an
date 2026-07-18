package models

import (
	"database/sql"
	"fmt"
	"log"
	"time"
)

type Score struct {
	ID      int
	Name    string
	Score   int
	Created time.Time
}

type DBModel struct {
	DB *sql.DB
}

func (m *DBModel) GetHighscore() (string, int) {
	db := m.DB
	var score int
	var name string

	query := `SELECT score, name FROM scoreboard WHERE score = (SELECT MIN(SCORE) FROM scoreboard);`
	err := db.QueryRow(query).Scan(&score, &name)
	if err != nil {
		log.Fatal(err)
	}

	return name, score
}

func (m *DBModel) SaveScore(Savedscore *Score) error {
	db := m.DB
	data := &Score{
		Name:  Savedscore.Name,
		Score: Savedscore.Score,
	}
	query := `INSERT INTO scoreboard (name, score) VALUES (?, ?)`
	_, err := db.Exec(query, data.Name, data.Score)
	if err != nil {
		return fmt.Errorf("error when saving score: %w", err)
	}

	return nil
}
