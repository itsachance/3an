package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	_ "github.com/ncruces/go-sqlite3/driver"
)

func main() {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "trean.db"
	}
	dsn := "file:" + dbPath + "?_pragma=journal_mode(WAL)&_pragma=synchronous(NORMAL)"
	db, err := sql.Open("sqlite3", dsn)
	if err != nil {
		log.Fatalf("An error has occured: %v\n", err)
	}
	defer db.Close()

	log.Printf("%s", "Listening on http://localhost:5500")
	err = http.ListenAndServe(":5500", Routes(db))
	log.Fatal(err)
}
