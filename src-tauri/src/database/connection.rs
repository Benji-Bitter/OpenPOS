use rusqlite::{Connection, Result as SqliteResult};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};

#[derive(Clone)]
pub struct Database {
    conn: Arc<Mutex<Connection>>,
}

impl Database {
    pub fn new(db_path: PathBuf) -> SqliteResult<Self> {
        let conn = Connection::open(db_path)?;
        Ok(Database { conn: Arc::new(Mutex::new(conn)) })
    }

    pub fn get_connection(&self) -> &Arc<Mutex<Connection>> {
        &self.conn
    }

    pub fn migrate(&self) -> SqliteResult<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute_batch(
            "BEGIN TRANSACTION;
             PRAGMA foreign_keys = ON;
             COMMIT;",
        )?;
        Ok(())
    }
}

pub fn get_database_path() -> PathBuf {
    std::path::PathBuf::from("openpos.db")
}
