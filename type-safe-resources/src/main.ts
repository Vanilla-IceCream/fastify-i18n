import app from './app.ts';

const server = app();

const start = async () => {
  try {
    await server.listen({
      host: process.env.HOST,
      port: Number(process.env.PORT),
    });
  } catch (err) {
    server.log.error(err);

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

start();
