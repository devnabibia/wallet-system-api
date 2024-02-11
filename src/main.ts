import { app } from "./app";
import { PORT } from "./constants/env-vars";

function bootstrap() {
  app.listen(PORT, () => {
    console.info(`Starting app on port ${PORT}`);
  });
}

bootstrap();
