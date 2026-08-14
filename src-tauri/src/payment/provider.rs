use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PaymentRequest {
    pub amount_cents: i64,
    pub currency: String,
    pub payment_method: PaymentMethod,
    pub metadata: Option<HashMap<String, String>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum PaymentMethod {
    Card,
    Cash,
    Contactless,
    BankTransfer,
    Other(String),
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PaymentResponse {
    pub payment_id: String,
    pub provider_payment_id: String,
    pub status: PaymentStatus,
    pub amount_cents: i64,
    pub currency: String,
    pub created_at: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum PaymentStatus {
    Pending,
    Authorized,
    Completed,
    Failed,
    Cancelled,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RefundRequest {
    pub payment_id: String,
    pub amount_cents: i64,
    pub reason: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RefundResponse {
    pub refund_id: String,
    pub provider_refund_id: String,
    pub status: RefundStatus,
    pub amount_cents: i64,
    pub currency: String,
    pub created_at: i64,
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
pub struct PaymentError {
    pub code: String,
    pub message: String,
    pub details: Option<String>,
}

#[async_trait]
pub trait PaymentProvider: Send + Sync {
    fn name(&self) -> &str;
    
    async fn create_payment(&self, request: PaymentRequest) -> Result<PaymentResponse, PaymentError>;
    
    async fn cancel_payment(&self, payment_id: &str) -> Result<PaymentResponse, PaymentError>;
    
    async fn get_payment_status(&self, payment_id: &str) -> Result<PaymentResponse, PaymentError>;
    
    async fn refund_payment(&self, request: RefundRequest) -> Result<RefundResponse, PaymentError>;
    
    async fn get_transaction(&self, transaction_id: &str) -> Result<PaymentResponse, PaymentError>;
    
    fn is_test_mode(&self) -> bool;
}
