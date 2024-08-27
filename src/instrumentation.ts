export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const isMockingEnabled = process.env.APP_ENV === 'testing';
    console.info({ isMockingEnabled, APP_ENV: process.env.APP_ENV });
    if (isMockingEnabled) {
      console.info('Starting Mock Server...');
      const { server } = await import('../cypress/mocks/node');
      server.listen();
      console.info('Mock Server Started!');
    }
  }
}
