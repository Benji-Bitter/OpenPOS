// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod payment;
mod hardware;
mod receipt;
mod transaction;

use database::Database;
use database::models::{Transaction, TransactionItem, TransactionStatus};

fn main() {
    let db = Database::new(
        database::get_database_path()
    ).expect("Failed to initialize database");
    
    db.migrate().expect("Failed to run migrations");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(db)
        .setup(|_app| {
            println!("OpenPOS initialized successfully");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
