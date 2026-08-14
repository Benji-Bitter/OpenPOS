use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Product {
    pub id: Option<i64>,
    pub name: String,
    pub description: Option<String>,
    pub price_cents: i64,
    pub category_id: Option<i64>,
    pub sku: Option<String>,
    pub barcode: Option<String>,
    pub tax_rate_cents: i64,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Category {
    pub id: Option<i64>,
    pub name: String,
    pub description: Option<String>,
    pub parent_id: Option<i64>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Transaction {
    pub id: Option<i64>,
    pub transaction_id: String,
    pub provider_transaction_id: Option<String>,
    pub amount_cents: i64,
    pub currency: String,
    pub payment_provider: String,
    pub payment_method: String,
    pub status: TransactionStatus,
    pub terminal_id: Option<String>,
    pub customer_id: Option<i64>,
    pub tax_cents: i64,
    pub discount_cents: i64,
    pub subtotal_cents: i64,
    pub receipt_data: Option<String>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum TransactionStatus {
    Pending,
    Authorized,
    Completed,
    Failed,
    Cancelled,
    Refunded,
    PartiallyRefunded,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TransactionItem {
    pub id: Option<i64>,
    pub transaction_id: i64,
    pub product_id: i64,
    pub quantity: i64,
    pub unit_price_cents: i64,
    pub total_cents: i64,
    pub discount_cents: i64,
    pub tax_cents: i64,
    pub created_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Customer {
    pub id: Option<i64>,
    pub name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub address: Option<String>,
    pub notes: Option<String>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Refund {
    pub id: Option<i64>,
    pub refund_id: String,
    pub transaction_id: i64,
    pub provider_refund_id: Option<String>,
    pub amount_cents: i64,
    pub currency: String,
    pub status: RefundStatus,
    pub reason: Option<String>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum RefundStatus {
    Pending,
    Completed,
    Failed,
    Cancelled,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Device {
    pub id: Option<i64>,
    pub device_id: String,
    pub device_type: DeviceType,
    pub name: String,
    pub connection_type: ConnectionType,
    pub capabilities: Option<String>,
    pub config: Option<String>,
    pub is_active: bool,
    pub last_seen: Option<i64>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum DeviceType {
    PaymentTerminal,
    ReceiptPrinter,
    BarcodeScanner,
    CashDrawer,
    CustomerDisplay,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum ConnectionType {
    Usb,
    Bluetooth,
    BluetoothLowEnergy,
    Lan,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ReceiptTemplate {
    pub id: Option<i64>,
    pub name: String,
    pub description: Option<String>,
    pub template_data: String,
    pub is_default: bool,
    pub template_type: ReceiptTemplateType,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum ReceiptTemplateType {
    CustomerReceipt,
    MerchantReceipt,
    KitchenReceipt,
    BarReceipt,
    Custom,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AuditLog {
    pub id: Option<i64>,
    pub event_type: String,
    pub entity_type: String,
    pub entity_id: Option<String>,
    pub details: Option<String>,
    pub user_id: Option<String>,
    pub created_at: i64,
}
