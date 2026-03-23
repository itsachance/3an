package models

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
	_ "github.com/mattn/go-sqlite3"
)

const (
	host     = "dockerdebian.achance.se"
	port     = 54321
	user     = "postgre"
	password = "postgre"
	//	user     = "POSTGRES-USERNAME"
	//	password = "POSTGRES-PASSWORD"
	dbname = "trean"
)

type Snippet struct {
	ID      int
	Name    string
	Score   int
	Created time.Time
}

type SnippetModel struct {
	DB *sql.DB
}

func (m *SnippetModel) GetHighscore() {
	db := m.DB
	var score int
	var name string

	query := `SELECT score, name FROM scoreboard WHERE score = (SELECT MIN(SCORE) FROM scoreboard);)`
	err := db.QueryRow(query).Scan(&score, &name)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Result: %v\n", query)
}

func createDb() {
	// Connect to DB
	db, err := sql.Open("sqlite3", "file:trean.db?_journal_mode=WAL&_synchronous=NORMAL")
	if err != nil {
		log.Printf("An error has occured: %s\n", err)
	}
	defer db.Close()
}

func createScoreboardTable(db *sql.DB) {
	query := `CREATE TABLE IF NOT EXISTS scoreboard(
		id INTEGER PRIMARY KEY,
		name TEXT NOT NULL UNIQUE,
		score INTEGER NOT NULL,
		created DATETIME DEFAULT CURRENT_TIMESTAMP);`

	_, err := db.Exec(query)
	if err != nil {
		log.Fatal(err)
	}
}

func Db() {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected!")

	var score int
	var name string

	query := `SELECT score, name FROM scoreboard WHERE score = (SELECT MIN(SCORE) FROM scoreboard)`
	err = db.QueryRow(query).Scan(&score, &name)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Err %v:", err)

	fmt.Printf("Result: %v\n", query)
}
