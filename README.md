# OpenPOS

A completely free and open-source point-of-sale application.

## Core Principles

- **Local-first**: No cloud backend required
- **Privacy-focused**: User-controlled data
- **No subscriptions**: Completely free and open-source
- **Modular architecture**: Extensible payment providers and hardware drivers
- **Premium UI**: Modern, polished desktop application experience

## Tech Stack

- **Desktop**: Tauri
- **Core**: Rust
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite

## Features

### Core POS
- Product catalog with categories
- Shopping cart with quantity controls
- Real-time subtotal, tax, and total calculation
- Product search and filtering
- Keyboard and mouse optimized interface

### Transaction System
- Complete transaction state machine
- SQLite database with proper migrations
- Support for multiple payment methods
- Transaction item tracking
- Status management (pending, authorized, completed, failed, cancelled, refunded)

### Payment Architecture
- Provider-based abstraction
- Stripe integration ready (stub implementation)
- Extensible for future providers (PayPal, etc.)

### Hardware Support
- Hardware manager abstraction
- Device discovery system
- Capability-based device support
- Support for multiple connection types (USB, Bluetooth, LAN)

### Receipt System
- Receipt engine with template system
- Custom receipt templates
- Receipt renderer with multiple component types
- Support for logos, text, dividers, item lists, totals, payments, barcodes, QR codes

## Installation

### Prerequisites
- Node.js 18+
- Rust and Cargo
- Tauri CLI

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/Benji-Bitter/OpenPOS.git
cd OpenPOS
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Development

The project follows a modular architecture:

- `src-tauri/src/database/` - SQLite database and migrations
- `src-tauri/src/payment/` - Payment provider abstraction
- `src-tauri/src/hardware/` - Hardware management
- `src-tauri/src/receipt/` - Receipt engine and templates
- `src-tauri/src/transaction/` - Transaction management
- `src/components/` - React UI components
- `src/types/` - TypeScript type definitions

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting pull requests.

## License

This project is open-source and available under the MIT License.

## Roadmap

- [ ] Complete Stripe integration with test/sandbox mode
- [ ] Hardware discovery and driver implementation
- [ ] ESC/POS printer support
- [ ] Receipt template designer UI
- [ ] Transaction history with filtering
- [ ] Natural language transaction filtering
- [ ] Audit log system
- [ ] Settings screens
- [ ] PayPal provider integration
- [ ] Backup system
- [ ] Comprehensive testing suite
- [ ] Windows and Linux support

## Support

For support, please visit https://devin.ai/support or open an issue on GitHub.
