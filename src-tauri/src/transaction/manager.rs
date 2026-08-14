use crate::database::models::{Transaction, TransactionItem, TransactionStatus};
use crate::database::Database;
use rusqlite::Result as SqliteResult;
use std::sync::Arc;
use tokio::sync::RwLock;

pub struct TransactionManager {
    db: Arc<RwLock<Database>>,
}

impl TransactionManager {
    pub fn new(db: Arc<RwLock<Database>>) -> Self {
        TransactionManager { db }
    }

    pub async fn create_transaction(&self, transaction: Transaction) -> SqliteResult<Transaction> {
        let db = self.db.read().await;
        let conn = db.get_connection();

        conn.execute(
            "INSERT INTO transactions (
                transaction_id, provider_transaction_id, amount_cents, currency,
                payment_provider, payment_method, status, terminal_id, customer_id,
                tax_cents, discount_cents, subtotal_cents, receipt_data
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
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
            ],
        )?;

        let id = conn.last_insert_rowid();
        let mut created_transaction = transaction.clone();
        created_transaction.id = Some(id);

        Ok(created_transaction)
    }

    pub async fn get_transaction(&self, transaction_id: &str) -> SqliteResult<Option<Transaction>> {
        let db = self.db.read().await;
        let conn = db.get_connection();

        let mut stmt = conn.prepare(
            "SELECT id, transaction_id, provider_transaction_id, amount_cents, currency,
                    payment_provider, payment_method, status, terminal_id, customer_id,
                    tax_cents, discount_cents, subtotal_cents, receipt_data, created_at, updated_at
             FROM transactions WHERE transaction_id = ?1",
        )?;

        let mut rows = stmt.query([transaction_id])?;

        if let Some(row) = rows.next()? {
            Ok(Some(Transaction {
                id: Some(row.get(0)?),
                transaction_id: row.get(1)?,
                provider_transaction_id: row.get(2)?,
                amount_cents: row.get(3)?,
                currency: row.get(4)?,
                payment_provider: row.get(5)?,
                payment_method: row.get(6)?,
                status: self.parse_status(&row.get::<_, String>(7)?),
                terminal_id: row.get(8)?,
                customer_id: row.get(9)?,
                tax_cents: row.get(10)?,
                discount_cents: row.get(11)?,
                subtotal_cents: row.get(12)?,
                receipt_data: row.get(13)?,
                created_at: row.get(14)?,
                updated_at: row.get(15)?,
            }))
        } else {
            Ok(None)
        }
    }

    pub async fn update_transaction_status(
        &self,
        transaction_id: &str,
        new_status: TransactionStatus,
    ) -> SqliteResult<()> {
        let db = self.db.write().await;
        let conn = db.get_connection();

        conn.execute(
            "UPDATE transactions SET status = ?1, updated_at = strftime('%s', 'now') WHERE transaction_id = ?2",
            [&format!("{:?}", new_status), transaction_id],
        )?;

        Ok(())
    }

    pub async fn add_transaction_item(&self, item: TransactionItem) -> SqliteResult<TransactionItem> {
        let db = self.db.write().await;
        let conn = db.get_connection();

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
        )?;

        let id = conn.last_insert_rowid();
        let mut created_item = item.clone();
        created_item.id = Some(id);

        Ok(created_item)
    }

    pub async fn get_transaction_items(&self, transaction_id: i64) -> SqliteResult<Vec<TransactionItem>> {
        let db = self.db.read().await;
        let conn = db.get_connection();

        let mut stmt = conn.prepare(
            "SELECT id, transaction_id, product_id, quantity, unit_price_cents,
                    total_cents, discount_cents, tax_cents, created_at
             FROM transaction_items WHERE transaction_id = ?1",
        )?;

        let mut rows = stmt.query([transaction_id])?;
        let mut items = Vec::new();

        while let Some(row) = rows.next()? {
            items.push(TransactionItem {
                id: Some(row.get(0)?),
                transaction_id: row.get(1)?,
                product_id: row.get(2)?,
                quantity: row.get(3)?,
                unit_price_cents: row.get(4)?,
                total_cents: row.get(5)?,
                discount_cents: row.get(6)?,
                tax_cents: row.get(7)?,
                created_at: row.get(8)?,
            });
        }

        Ok(items)
    }

    fn parse_status(&self, status_str: &str) -> TransactionStatus {
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
}
