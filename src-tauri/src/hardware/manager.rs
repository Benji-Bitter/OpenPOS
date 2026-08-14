use super::device::Device;
use std::sync::Arc;
use tokio::sync::RwLock;

pub struct HardwareManager {
    devices: Arc<RwLock<Vec<Device>>>,
}

impl HardwareManager {
    pub fn new() -> Self {
        HardwareManager {
            devices: Arc::new(RwLock::new(Vec::new())),
        }
    }

    pub async fn discover_devices(&self) -> Result<Vec<Device>, String> {
        // TODO: Implement actual device discovery
        // For now, return empty list
        Ok(Vec::new())
    }

    pub async fn get_devices(&self) -> Vec<Device> {
        self.devices.read().await.clone()
    }

    pub async fn add_device(&self, device: Device) -> Result<(), String> {
        let mut devices = self.devices.write().await;
        devices.push(device);
        Ok(())
    }

    pub async fn remove_device(&self, device_id: &str) -> Result<(), String> {
        let mut devices = self.devices.write().await;
        devices.retain(|d| d.device_id != device_id);
        Ok(())
    }

    pub async fn get_device(&self, device_id: &str) -> Option<Device> {
        let devices = self.devices.read().await;
        devices.iter().find(|d| d.device_id == device_id).cloned()
    }

    pub async fn update_device(&self, device_id: &str, updated_device: Device) -> Result<(), String> {
        let mut devices = self.devices.write().await;
        if let Some(device) = devices.iter_mut().find(|d| d.device_id == device_id) {
            *device = updated_device;
            Ok(())
        } else {
            Err("Device not found".to_string())
        }
    }
}

impl Default for HardwareManager {
    fn default() -> Self {
        Self::new()
    }
}
