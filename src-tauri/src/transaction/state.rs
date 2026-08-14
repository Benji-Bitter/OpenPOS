use crate::database::models::TransactionStatus;
use std::sync::Arc;
use tokio::sync::RwLock;

pub struct TransactionStateMachine {
    state: Arc<RwLock<TransactionStatus>>,
}

impl TransactionStateMachine {
    pub fn new(initial_status: TransactionStatus) -> Self {
        TransactionStateMachine {
            state: Arc::new(RwLock::new(initial_status)),
        }
    }

    pub async fn get_state(&self) -> TransactionStatus {
        self.state.read().await.clone()
    }

    pub async fn transition_to(&self, new_status: TransactionStatus) -> Result<(), String> {
        let current_state = self.state.read().await.clone();
        
        if self.is_valid_transition(&current_state, &new_status) {
            let mut state = self.state.write().await;
            *state = new_status;
            Ok(())
        } else {
            Err(format!(
                "Invalid state transition from {:?} to {:?}",
                current_state, new_status
            ))
        }
    }

    fn is_valid_transition(&self, from: &TransactionStatus, to: &TransactionStatus) -> bool {
        match (from, to) {
            // Valid transitions
            (TransactionStatus::Pending, TransactionStatus::Authorized) => true,
            (TransactionStatus::Pending, TransactionStatus::Failed) => true,
            (TransactionStatus::Pending, TransactionStatus::Cancelled) => true,
            (TransactionStatus::Authorized, TransactionStatus::Completed) => true,
            (TransactionStatus::Authorized, TransactionStatus::Failed) => true,
            (TransactionStatus::Authorized, TransactionStatus::Cancelled) => true,
            (TransactionStatus::Completed, TransactionStatus::Refunded) => true,
            (TransactionStatus::Completed, TransactionStatus::PartiallyRefunded) => true,
            (TransactionStatus::PartiallyRefunded, TransactionStatus::Refunded) => true,
            (TransactionStatus::PartiallyRefunded, TransactionStatus::PartiallyRefunded) => true,
            
            // Invalid transitions
            _ => false,
        }
    }
}

impl Default for TransactionStateMachine {
    fn default() -> Self {
        Self::new(TransactionStatus::Pending)
    }
}
