// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod payment;
mod hardware;
mod receipt;
mod transaction;

use database::Database;
use database::get_database_path;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let db_path = get_database_path(app.handle());
            let db = Database::new(db_path).expect("Failed to initialize database");
            database::run_migrations(db.get_connection()).expect("Failed to run migrations");
            
            println!("OpenPOS initialized successfully");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
