import { createApp } from './app';

const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  try {
    const app = createApp();

    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║  Hostel Room Allocation System Backend Server            ║
║  Environment: ${process.env.NODE_ENV || 'development'.padEnd(22)} ║
║  Server running on: http:
║  Health check: http:
║  API Base URL: http:
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
