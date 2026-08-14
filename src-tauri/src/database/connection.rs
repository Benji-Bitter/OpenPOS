use rusqlite::{Connection, Result as SqliteResult};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new(db_path: PathBuf) -> SqliteResult<Self> {
        let conn = Connection::open(db_path)?;
        Ok(Database { conn })
    }

    pub fn get_connection(&self) -> &Connection {
        &self.conn
    }

    pub fn migrate(&mut self) -> SqliteResult<()> {
        self.conn.execute_batch(
            "BEGIN TRANSACTION;
             PRAGMA foreign_keys = ON;
             COMMIT;",
        )?;
        Ok(())
    }
}

pub fn get_database_path(app: &AppHandle) -> PathBuf {
    app.path()
        .app_data_dir()
        .expect("Failed to get app data directory")
        .join("openpos.db")
}
