use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ReceiptTemplate {
    pub id: Option<i64>,
    pub name: String,
    pub description: Option<String>,
    pub components: Vec<ReceiptComponent>,
    pub template_type: ReceiptTemplateType,
    pub is_default: bool,
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
#[serde(tag = "type", content = "data")]
pub enum ReceiptComponent {
    Logo(LogoComponent),
    Text(TextComponent),
    Divider(DividerComponent),
    ItemList(ItemListComponent),
    Total(TotalComponent),
    Payment(PaymentComponent),
    Footer(FooterComponent),
    Barcode(BarcodeComponent),
    QRCode(QRCodeComponent),
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LogoComponent {
    pub id: String,
    pub visible: bool,
    pub alignment: Alignment,
    pub size: u32,
    pub image_data: Option<String>, // Base64 encoded
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TextComponent {
    pub id: String,
    pub visible: bool,
    pub alignment: Alignment,
    pub font_size: u32,
    pub font_weight: FontWeight,
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DividerComponent {
    pub id: String,
    pub visible: bool,
    pub style: DividerStyle,
    pub thickness: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ItemListComponent {
    pub id: String,
    pub visible: bool,
    pub show_quantity: bool,
    pub show_unit_price: bool,
    pub show_discount: bool,
    pub show_tax: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TotalComponent {
    pub id: String,
    pub visible: bool,
    pub show_subtotal: bool,
    pub show_tax: bool,
    pub show_discount: bool,
    pub show_total: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PaymentComponent {
    pub id: String,
    pub visible: bool,
    pub show_payment_method: bool,
    pub show_masked_card: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FooterComponent {
    pub id: String,
    pub visible: bool,
    pub alignment: Alignment,
    pub font_size: u32,
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BarcodeComponent {
    pub id: String,
    pub visible: bool,
    pub alignment: Alignment,
    pub height: u32,
    pub width: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct QRCodeComponent {
    pub id: String,
    pub visible: bool,
    pub alignment: Alignment,
    pub size: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum Alignment {
    Left,
    Center,
    Right,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum FontWeight {
    Normal,
    Bold,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum DividerStyle {
    Single,
    Double,
    Dashed,
}
