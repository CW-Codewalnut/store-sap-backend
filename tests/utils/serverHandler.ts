import { server } from '../../src/app';

let counter = 0;

const startServer = async () => {
  if (counter === 0) {
    await new Promise<void>((resolve) => {
      server.on('listening', () => {
        resolve();
      });
    });
  }
  counter++;
};

const stopServer = async () => {
  counter--;
  if (counter === 0) {
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  }
};

export { startServer, stopServer };
