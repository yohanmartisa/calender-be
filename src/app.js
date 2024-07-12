import Config from '../config';
import { ExpressFactory } from '../config/express';

async function bootstrap() {
  const config = Config.get('/');
  const app = await ExpressFactory.create(config);

  try {
    await app.listen(
      config.port || '3000',
      () => console.info(`Server running at: ${config.port} (${config.env})`)
    );
  } catch (err) {
    console.error(`An error occured starting the server: ${err}. Shutting Down!`);
    process.exit(1);
  }
}

bootstrap();
