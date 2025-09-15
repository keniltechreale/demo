var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import logger from './lib/logger';
import { Server } from 'socket.io';
import { createServer } from 'http';
import config from './config/config';
import * as ServerUtils from './lib/server.utils';
import * as DBUtils from './lib/db.utils';
import AppUtils from './lib/app.utils';
import IntializeSocket from './lib/socket.server';
let io;
void (() => __awaiter(void 0, void 0, void 0, function* () {
    // Connect Database
    yield DBUtils.connect();
    yield AppUtils.init();
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
}))();
export { io };
//# sourceMappingURL=server.js.map