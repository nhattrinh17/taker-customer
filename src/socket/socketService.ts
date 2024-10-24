import { StatusActivity } from 'modules/activity/typings';
import { SOCKET_URL } from 'services/src/APIConfig';
import io, { Socket } from 'socket.io-client';

interface ResponseSocket {
  lat: number;
  lng: number;
  type: string;
  data: any;
  message: string;
  status: StatusActivity;
}
class SocketService {
  private static instance: SocketService | null = null;
  private socket: Socket | undefined;

  private constructor(private token: string) {
    this.socket = io(SOCKET_URL, {
      auth: {
        token: this.token,
      },
    });
    // console.log('🚀 ~ SocketService ~ constructor ~ SOCKET_URL:', this.socket);
  }

  public static getInstance(token?: string): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService(token ?? '');
    }
    return SocketService.instance;
  }

  public on(event: string, callback: (response: ResponseSocket) => void): void {
    if (!this.socket) {
      console.log('Socket is not initialized. Call getInstance() first.');
      return;
    }
    console.log('On event ==>', event);

    this.socket.on(event, (data: ResponseSocket) => {
      console.log('Receive Data socket ==>', { data, event });
      callback(data);
    });
  }
  public emit(event: string, args: any): void {
    if (!this.socket) {
      console.log('Socket is not initialized. Call getInstance() first.');
      return;
    }
    console.log('Emit event ==>', event);
    this.socket.emit(event, args);
  }

  public off(event: string): void {
    if (!this.socket) {
      console.log('Socket is not initialized. Call getInstance() first.');
      return;
    }
    console.log('Off event ==>', event);
    this.socket.off(event);
  }

  public offAny(): void {
    if (!this.socket) {
      console.log('Socket is not initialized. Call getInstance() first.');
      return;
    }
    this.socket.offAny();
  }

  public offAnyOutgoing(): void {
    if (!this.socket) {
      console.log('Socket is not initialized. Call getInstance() first.');
      return;
    }
    this.socket.offAnyOutgoing();
  }

  public once(event: string, callback: (response: ResponseSocket) => void): void {
    if (!this.socket) {
      console.log('Socket is not initialized. Call getInstance() first.');
      return;
    }

    this.socket.once(event, (data: ResponseSocket) => {
      console.log('Receive Data socket ==>', { data, event });
      callback(data);
    });
  }
}

export default SocketService;
