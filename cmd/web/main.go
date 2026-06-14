package main

import (
	"database/sql"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "file:trean.db?_journal_mode=WAL&_synchronous=NORMAL")
	if err != nil {
		log.Printf("An error has occured: %s\n", err)
	}
	defer db.Close()

	query := `CREATE TABLE IF NOT EXISTS scoreboard(
		id INTEGER PRIMARY KEY,
		name TEXT NOT NULL UNIQUE,
		score INTEGER NOT NULL,
		created DATETIME DEFAULT CURRENT_TIMESTAMP);`

	_, err = db.Exec(query)
	if err != nil {
		log.Printf("SQL table couldn't be created: %v", err)
	}

	log.Printf("%s", "Listening on http://localhost:5500")
	err = http.ListenAndServe(":5500", Routes(db))
	log.Fatal(err)
}
