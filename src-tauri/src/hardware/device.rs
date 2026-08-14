use serde::{Deserialize, Serialize};
use super::capabilities::DeviceCapabilities;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Device {
    pub device_id: String,
    pub device_type: DeviceType,
    pub name: String,
    pub connection_type: ConnectionType,
    pub capabilities: DeviceCapabilities,
    pub is_active: bool,
    pub last_seen: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum DeviceType {
    PaymentTerminal,
    ReceiptPrinter,
    BarcodeScanner,
    CashDrawer,
    CustomerDisplay,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ConnectionType {
    Usb,
    Bluetooth,
    BluetoothLowEnergy,
    Lan,
}
