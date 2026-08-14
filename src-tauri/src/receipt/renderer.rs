use super::template::{ReceiptTemplate, ReceiptComponent, TextComponent, DividerComponent, ItemListComponent, TotalComponent, PaymentComponent, FooterComponent, LogoComponent, BarcodeComponent, QRCodeComponent, Alignment, DividerStyle};
use crate::database::models::Transaction;

pub struct ReceiptRenderer;

impl ReceiptRenderer {
    pub fn new() -> Self {
        ReceiptRenderer
    }

    pub fn render(&self, template: &ReceiptTemplate, transaction: &Transaction) -> Result<String, String> {
        let mut output = String::new();

        for component in &template.components {
            self.render_component(component, transaction, &mut output)?;
        }

        Ok(output)
    }

    fn render_component(
        &self,
        component: &ReceiptComponent,
        transaction: &Transaction,
        output: &mut String,
    ) -> Result<(), String> {
        match component {
            ReceiptComponent::Text(text) => {
                if text.visible {
                    self.render_text(text, output);
                }
            }
            ReceiptComponent::Divider(divider) => {
                if divider.visible {
                    self.render_divider(divider, output);
                }
            }
            ReceiptComponent::ItemList(items) => {
                if items.visible {
                    self.render_item_list(items, transaction, output);
                }
            }
            ReceiptComponent::Total(total) => {
                if total.visible {
                    self.render_total(total, transaction, output);
                }
            }
            ReceiptComponent::Payment(payment) => {
                if payment.visible {
                    self.render_payment(payment, transaction, output);
                }
            }
            ReceiptComponent::Footer(footer) => {
                if footer.visible {
                    self.render_footer(footer, output);
                }
            }
            ReceiptComponent::Logo(logo) => {
                if logo.visible {
                    self.render_logo(logo, output);
                }
            }
            ReceiptComponent::Barcode(barcode) => {
                if barcode.visible {
                    self.render_barcode(barcode, output);
                }
            }
            ReceiptComponent::QRCode(qrcode) => {
                if qrcode.visible {
                    self.render_qrcode(qrcode, output);
                }
            }
        }

        Ok(())
    }

    fn render_text(&self, text: &TextComponent, output: &mut String) {
        let aligned = self.align_text(&text.content, &text.alignment);
        output.push_str(&aligned);
        output.push('\n');
    }

    fn render_divider(&self, divider: &DividerComponent, output: &mut String) {
        let divider_char = match &divider.style {
            DividerStyle::Single => "-",
            DividerStyle::Double => "=",
            DividerStyle::Dashed => "-",
        };
        let line = divider_char.repeat(40);
        output.push_str(&line);
        output.push('\n');
    }

    fn render_item_list(
        &self,
        _items: &ItemListComponent,
        _transaction: &Transaction,
        output: &mut String,
    ) {
        // TODO: Implement actual item list rendering from transaction items
        output.push_str("Items would be rendered here\n");
    }

    fn render_total(
        &self,
        total: &TotalComponent,
        transaction: &Transaction,
        output: &mut String,
    ) {
        if total.show_subtotal {
            output.push_str(&format!("Subtotal: ${:.2}\n", transaction.subtotal_cents as f64 / 100.0));
        }
        if total.show_tax {
            output.push_str(&format!("Tax: ${:.2}\n", transaction.tax_cents as f64 / 100.0));
        }
        if total.show_discount {
            output.push_str(&format!("Discount: ${:.2}\n", transaction.discount_cents as f64 / 100.0));
        }
        if total.show_total {
            output.push_str(&format!("Total: ${:.2}\n", transaction.amount_cents as f64 / 100.0));
        }
    }

    fn render_payment(
        &self,
        payment: &PaymentComponent,
        transaction: &Transaction,
        output: &mut String,
    ) {
        if payment.show_payment_method {
            output.push_str(&format!("Payment: {}\n", transaction.payment_method));
        }
        if payment.show_masked_card {
            output.push_str("Card: **** **** **** 1234\n");
        }
    }

    fn render_footer(&self, footer: &FooterComponent, output: &mut String) {
        let aligned = self.align_text(&footer.content, &footer.alignment);
        output.push_str(&aligned);
        output.push('\n');
    }

    fn render_logo(&self, _logo: &LogoComponent, output: &mut String) {
        output.push_str("[LOGO]\n");
    }

    fn render_barcode(&self, _barcode: &BarcodeComponent, output: &mut String) {
        output.push_str("[BARCODE]\n");
    }

    fn render_qrcode(&self, _qrcode: &QRCodeComponent, output: &mut String) {
        output.push_str("[QRCODE]\n");
    }

    fn align_text(&self, text: &str, alignment: &Alignment) -> String {
        match alignment {
            Alignment::Left => text.to_string(),
            Alignment::Center => {
                let padding = (40 - text.len()) / 2;
                format!("{}{}", " ".repeat(padding.max(0)), text)
            }
            Alignment::Right => {
                let padding = 40 - text.len();
                format!("{}{}", " ".repeat(padding.max(0)), text)
            }
        }
    }
}

impl Default for ReceiptRenderer {
    fn default() -> Self {
        Self::new()
    }
}
