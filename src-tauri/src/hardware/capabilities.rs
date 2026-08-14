use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DeviceCapabilities {
    pub device_type: DeviceCapabilitiesType,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(tag = "type", content = "capabilities")]
pub enum DeviceCapabilitiesType {
    Printer(PrinterCapabilities),
    Scanner(ScannerCapabilities),
    Terminal(TerminalCapabilities),
    CashDrawer(CashDrawerCapabilities),
    Display(DisplayCapabilities),
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PrinterCapabilities {
    pub width_mm: Option<u32>,
    pub character_width: Option<u32>,
    pub supports_text: bool,
    pub supports_bold: bool,
    pub supports_underline: bool,
    pub supports_alignment: bool,
    pub supports_images: bool,
    pub supports_qr_codes: bool,
    pub supports_barcodes: bool,
    pub supports_paper_cutting: bool,
    pub supports_cash_drawer_control: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ScannerCapabilities {
    pub supports_barcode_1d: bool,
    pub supports_barcode_2d: bool,
    pub supports_qr_codes: bool,
    pub auto_trigger: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TerminalCapabilities {
    pub supports_card_present: bool,
    pub supports_contactless: bool,
    pub supports_pin_entry: bool,
    pub has_printer: bool,
    pub has_customer_display: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CashDrawerCapabilities {
    pub supports_open: bool,
    pub supports_status_check: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DisplayCapabilities {
    pub width_pixels: Option<u32>,
    pub height_pixels: Option<u32>,
    pub supports_text: bool,
    pub supports_images: bool,
    pub supports_line_display: bool,
}
