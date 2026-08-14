use super::template::{ReceiptTemplate, ReceiptComponent};
use super::renderer::ReceiptRenderer;
use crate::database::models::Transaction;
use std::sync::Arc;

pub struct ReceiptEngine {
    renderer: Arc<ReceiptRenderer>,
}

impl ReceiptEngine {
    pub fn new() -> Self {
        ReceiptEngine {
            renderer: Arc::new(ReceiptRenderer::new()),
        }
    }

    pub fn render_receipt(
        &self,
        template: &ReceiptTemplate,
        transaction: &Transaction,
    ) -> Result<String, String> {
        self.renderer.render(template, transaction)
    }

    pub fn validate_template(&self, template: &ReceiptTemplate) -> Result<(), String> {
        // Validate template structure
        if template.name.is_empty() {
            return Err("Template name cannot be empty".to_string());
        }

        if template.components.is_empty() {
            return Err("Template must have at least one component".to_string());
        }

        // Validate each component
        for component in &template.components {
            self.validate_component(component)?;
        }

        Ok(())
    }

    fn validate_component(&self, component: &ReceiptComponent) -> Result<(), String> {
        match component {
            ReceiptComponent::Text(text) => {
                if text.content.is_empty() {
                    return Err("Text component cannot have empty content".to_string());
                }
            }
            ReceiptComponent::Logo(logo) => {
                if logo.image_data.is_none() {
                    return Err("Logo component must have image data".to_string());
                }
            }
            _ => {}
        }
        Ok(())
    }
}

impl Default for ReceiptEngine {
    fn default() -> Self {
        Self::new()
    }
}
