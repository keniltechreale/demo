import logger from './lib/logger';
import { Server } from 'socket.io';
import { createServer } from 'http';
import config from './config/config';
import * as ServerUtils from './lib/server.utils';
import * as DBUtils from './lib/db.utils';
import AppUtils from './lib/app.utils';
import IntializeSocket from './lib/socket.server';
let io: Server;

void (async () => {
  // Connect Database
  await DBUtils.connect();

  await AppUtils.init();

  // Setup App

  // Connect Server
  ServerUtils.createServer()
    .then((app) => {
      // Start the server
      const PORT = config.PORT;
      const httpServer = createServer(app);
      io = new Server(httpServer, { cors: { origin: '*' }, path: '/findDrivers/' });
      IntializeSocket(io);

      httpServer.listen(PORT);
      // app.listen(PORT);
      logger.info(`Server is running on port ${PORT}`);

      // await connection();
    })
    .catch((err) => {
      logger.error(err);
    });
})();

export { io };
