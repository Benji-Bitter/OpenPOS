// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod payment;
mod hardware;
mod receipt;
mod transaction;

use database::Database;
use database::models::{Transaction, TransactionItem, TransactionStatus};
use receipt::engine::ReceiptEngine;
use receipt::template::ReceiptTemplate;

#[tauri::command]
fn create_transaction(
    transaction: Transaction,
    db: tauri::State<'_, Database>,
) -> Result<Transaction, String> {
    let db = db.inner().clone();
    let conn = db.get_connection().lock().unwrap();
    
    conn.execute(
        "INSERT INTO transactions (
            transaction_id, provider_transaction_id, amount_cents, currency,
            payment_provider, payment_method, status, terminal_id, customer_id,
            tax_cents, discount_cents, subtotal_cents, receipt_data, cashier_id
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)",
        [
            &transaction.transaction_id,
            transaction.provider_transaction_id.as_deref().unwrap_or(""),
            &(transaction.amount_cents.to_string()),
            &transaction.currency,
            &transaction.payment_provider,
            &transaction.payment_method,
            &format!("{:?}", transaction.status),
            transaction.terminal_id.as_deref().unwrap_or(""),
            &transaction.customer_id.map(|id| id.to_string()).unwrap_or_default(),
            &(transaction.tax_cents.to_string()),
            &(transaction.discount_cents.to_string()),
            &(transaction.subtotal_cents.to_string()),
            transaction.receipt_data.as_deref().unwrap_or(""),
            transaction.cashier_id.as_deref().unwrap_or(""),
        ],
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    let mut created_transaction = transaction.clone();
    created_transaction.id = Some(id);

    Ok(created_transaction)
}

#[tauri::command]
fn get_transaction(
    transaction_id: String,
    db: tauri::State<'_, Database>,
) -> Result<Option<Transaction>, String> {
    let db = db.inner().clone();
    let conn = db.get_connection().lock().unwrap();

    let mut stmt = conn.prepare(
        "SELECT id, transaction_id, provider_transaction_id, amount_cents, currency,
                payment_provider, payment_method, status, terminal_id, customer_id,
                tax_cents, discount_cents, subtotal_cents, receipt_data, cashier_id, created_at, updated_at
         FROM transactions WHERE transaction_id = ?1",
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query([transaction_id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(Some(Transaction {
            id: Some(row.get(0).map_err(|e| e.to_string())?),
            transaction_id: row.get(1).map_err(|e| e.to_string())?,
            provider_transaction_id: row.get(2).map_err(|e| e.to_string())?,
            amount_cents: row.get(3).map_err(|e| e.to_string())?,
            currency: row.get(4).map_err(|e| e.to_string())?,
            payment_provider: row.get(5).map_err(|e| e.to_string())?,
            payment_method: row.get(6).map_err(|e| e.to_string())?,
            status: parse_status(&row.get::<_, String>(7).map_err(|e| e.to_string())?),
            terminal_id: row.get(8).map_err(|e| e.to_string())?,
            customer_id: row.get(9).map_err(|e| e.to_string())?,
            tax_cents: row.get(10).map_err(|e| e.to_string())?,
            discount_cents: row.get(11).map_err(|e| e.to_string())?,
            subtotal_cents: row.get(12).map_err(|e| e.to_string())?,
            receipt_data: row.get(13).map_err(|e| e.to_string())?,
            cashier_id: row.get(14).map_err(|e| e.to_string())?,
            created_at: row.get(15).map_err(|e| e.to_string())?,
            updated_at: row.get(16).map_err(|e| e.to_string())?,
        }))
    } else {
        Ok(None)
    }
}

#[tauri::command]
fn update_transaction_status(
    transaction_id: String,
    status: String,
    db: tauri::State<'_, Database>,
) -> Result<(), String> {
    let db = db.inner().clone();
    let conn = db.get_connection().lock().unwrap();
    let parsed_status = match status.to_lowercase().as_str() {
        "pending" => TransactionStatus::Pending,
        "authorized" => TransactionStatus::Authorized,
        "completed" => TransactionStatus::Completed,
        "failed" => TransactionStatus::Failed,
        "cancelled" => TransactionStatus::Cancelled,
        "refunded" => TransactionStatus::Refunded,
        "partially_refunded" => TransactionStatus::PartiallyRefunded,
        _ => return Err("Invalid status".to_string()),
    };

    conn.execute(
        "UPDATE transactions SET status = ?1, updated_at = strftime('%s', 'now') WHERE transaction_id = ?2",
        [&format!("{:?}", parsed_status), &transaction_id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn add_transaction_item(
    item: TransactionItem,
    db: tauri::State<'_, Database>,
) -> Result<TransactionItem, String> {
    let db = db.inner().clone();
    let conn = db.get_connection().lock().unwrap();

    conn.execute(
        "INSERT INTO transaction_items (
            transaction_id, product_id, quantity, unit_price_cents,
            total_cents, discount_cents, tax_cents
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        [
            &(item.transaction_id.to_string()),
            &(item.product_id.to_string()),
            &(item.quantity.to_string()),
            &(item.unit_price_cents.to_string()),
            &(item.total_cents.to_string()),
            &(item.discount_cents.to_string()),
            &(item.tax_cents.to_string()),
        ],
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    let mut created_item = item.clone();
    created_item.id = Some(id);

    Ok(created_item)
}

#[tauri::command]
fn get_transaction_items(
    transaction_id: i64,
    db: tauri::State<'_, Database>,
) -> Result<Vec<TransactionItem>, String> {
    let db = db.inner().clone();
    let conn = db.get_connection().lock().unwrap();

    let mut stmt = conn.prepare(
        "SELECT id, transaction_id, product_id, quantity, unit_price_cents,
                total_cents, discount_cents, tax_cents, created_at
         FROM transaction_items WHERE transaction_id = ?1",
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query([transaction_id]).map_err(|e| e.to_string())?;
    let mut items = Vec::new();

    while let Some(row) = rows.next().map_err(|e| e.to_string())? {
        items.push(TransactionItem {
            id: Some(row.get(0).map_err(|e| e.to_string())?),
            transaction_id: row.get(1).map_err(|e| e.to_string())?,
            product_id: row.get(2).map_err(|e| e.to_string())?,
            quantity: row.get(3).map_err(|e| e.to_string())?,
            unit_price_cents: row.get(4).map_err(|e| e.to_string())?,
            total_cents: row.get(5).map_err(|e| e.to_string())?,
            discount_cents: row.get(6).map_err(|e| e.to_string())?,
            tax_cents: row.get(7).map_err(|e| e.to_string())?,
            created_at: row.get(8).map_err(|e| e.to_string())?,
        });
    }

    Ok(items)
}

#[tauri::command]
fn render_receipt(
    template: ReceiptTemplate,
    transaction: Transaction,
) -> Result<String, String> {
    let engine = ReceiptEngine::new();
    engine.render_receipt(&template, &transaction)
}

#[tauri::command]
fn validate_template(template: ReceiptTemplate) -> Result<(), String> {
    let engine = ReceiptEngine::new();
    engine.validate_template(&template)
}

fn parse_status(status_str: &str) -> TransactionStatus {
    match status_str.to_lowercase().as_str() {
        "pending" => TransactionStatus::Pending,
        "authorized" => TransactionStatus::Authorized,
        "completed" => TransactionStatus::Completed,
        "failed" => TransactionStatus::Failed,
        "cancelled" => TransactionStatus::Cancelled,
        "refunded" => TransactionStatus::Refunded,
        "partially_refunded" => TransactionStatus::PartiallyRefunded,
        _ => TransactionStatus::Pending,
    }
}

fn main() {
    let db = Database::new(
        database::get_database_path()
    ).expect("Failed to initialize database");
    
    db.migrate().expect("Failed to run migrations");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(db)
        .invoke_handler(tauri::generate_handler![
            create_transaction,
            get_transaction,
            update_transaction_status,
            add_transaction_item,
            get_transaction_items,
            render_receipt,
            validate_template
        ])
        .setup(|_app| {
            println!("OpenPOS initialized successfully");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
