import { Server, Socket } from 'socket.io';
import logger from './logger';
const orderNamespaces = new Map();

export default function initializeSocket(io: Server) {
  const driverNamespace = io.of('/drivers');
  const customerNamespace = io.of('/customers');

  driverNamespace.on('connection', (client: Socket) => {
    client.on('register', (userId: string) => {
      client.emit('connection status', 'registered', userId);
      logger.info(`[Socket] Driver connected: ${client.id}`);
    });

    client.on('disconnect', () => {
      logger.info(`[Socket] Driver disconnected: ${client.id}`);
    });
  });

  customerNamespace.on('connection', (client: Socket) => {
    client.on('register', (userId: string) => {
      client.emit('connection status', 'registered', userId);
      logger.info(`[Socket] Customer connected: ${client.id}`);
    });

    client.on('disconnect', () => {
      logger.info(`[Socket] Customer disconnected: ${client.id}`);
    });
  });

  io.on('connection', (client: Socket) => {
    client.on('rideIDregister', async (orderId: string) => {
      if (!orderNamespaces.has(orderId)) {
        const nsp = io.of(`/rides/${orderId}`);
        nsp.on('connection', async (orderClient: Socket) => {
          await orderClient.join(orderId);
          orderClient.on('location update', (locationData: any) => {
            nsp.to(orderId).emit('location update', locationData);
          });
        });
        orderNamespaces.set(orderId, nsp);
      }
      await client.join(`/rides/${orderId}`);
      client.emit('connection status', 'registered', orderId);
    });

    client.on('disconnect', () => {
      logger.info(`[Socket] Client disconnected: ${client.id}`);
    });
  });

  io.on('error', (error) => {
    logger.error(`Socket.io error: ${error}`);
  });
}
