use rusqlite::{Connection, Result as SqliteResult};

pub fn run_migrations(conn: &Connection) -> SqliteResult<()> {
    // Enable foreign keys
    conn.execute("PRAGMA foreign_keys = ON;", [])?;

    // Create products table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price_cents INTEGER NOT NULL,
            category_id INTEGER,
            sku TEXT UNIQUE,
            barcode TEXT,
            tax_rate_cents INTEGER DEFAULT 0,
            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        )",
        [],
    )?;

    // Create categories table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            parent_id INTEGER,
            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
        )",
        [],
    )?;

    // Create transactions table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transaction_id TEXT UNIQUE NOT NULL,
            provider_transaction_id TEXT,
            amount_cents INTEGER NOT NULL,
            currency TEXT NOT NULL DEFAULT 'USD',
            payment_provider TEXT NOT NULL,
            payment_method TEXT NOT NULL,
            status TEXT NOT NULL,
            terminal_id TEXT,
            customer_id INTEGER,
            tax_cents INTEGER DEFAULT 0,
            discount_cents INTEGER DEFAULT 0,
            subtotal_cents INTEGER NOT NULL,
            receipt_data TEXT,
            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
        )",
        [],
    )?;

    // Create transaction_items table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS transaction_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transaction_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price_cents INTEGER NOT NULL,
            total_cents INTEGER NOT NULL,
            discount_cents INTEGER DEFAULT 0,
            tax_cents INTEGER DEFAULT 0,
            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
        )",
        [],
    )?;

    // Create customers table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            phone TEXT,
            address TEXT,
            notes TEXT,
            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        )",
        [],
    )?;

    // Create refunds table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS refunds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            refund_id TEXT UNIQUE NOT NULL,
            transaction_id INTEGER NOT NULL,
            provider_refund_id TEXT,
            amount_cents INTEGER NOT NULL,
            currency TEXT NOT NULL DEFAULT 'USD',
            status TEXT NOT NULL,
            reason TEXT,
            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
        )",
        [],
    )?;

    // Create devices table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS devices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id TEXT UNIQUE NOT NULL,
            device_type TEXT NOT NULL,
            name TEXT NOT NULL,
            connection_type TEXT NOT NULL,
            capabilities TEXT,
            config TEXT,
            is_active BOOLEAN DEFAULT 0,
            last_seen INTEGER,
            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        )",
        [],
    )?;

    // Create receipt_templates table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS receipt_templates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            template_data TEXT NOT NULL,
            is_default BOOLEAN DEFAULT 0,
            template_type TEXT NOT NULL,
            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        )",
        [],
    )?;

    // Create audit_logs table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            entity_type TEXT NOT NULL,
            entity_id TEXT,
            details TEXT,
            user_id TEXT,
            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        )",
        [],
    )?;

    // Create indexes for better query performance
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)",
        [],
    )?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku)",
        [],
    )?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode)",
        [],
    )?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status)",
        [],
    )?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at)",
        [],
    )?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction ON transaction_items(transaction_id)",
        [],
    )?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email)",
        [],
    )?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_refunds_transaction ON refunds(transaction_id)",
        [],
    )?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type)",
        [],
    )?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)",
        [],
    )?;

    Ok(())
}
