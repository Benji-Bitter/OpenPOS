function App() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 bg-white dark:bg-gray-950">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">OP</span>
          </div>
          <h1 className="text-lg font-semibold">OpenPOS</h1>
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <nav className="space-y-1">
            <button className="w-full text-left px-3 py-2 rounded-md bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-medium">
              POS
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
              Transactions
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
              Products
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
              Inventory
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
              Customers
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
              Devices
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
              Settings
            </button>
          </nav>
        </aside>
        
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-semibold mb-4">Point of Sale</h2>
              <p className="text-gray-600 dark:text-gray-400">
                OpenPOS is initializing...
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
