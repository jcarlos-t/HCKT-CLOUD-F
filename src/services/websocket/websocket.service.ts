import Api from "../api";
import type { NotificacionWebSocket } from "../../interfaces/websocket.interface";

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private token: string | null = null;
  private listeners: Set<(notification: NotificacionWebSocket) => void> = new Set();

  constructor() {}

  public connect(token: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log("WebSocket ya está conectado");
      return;
    }

    this.token = token;
    const wsUrl = Api.getWebSocketUrl();
    const url = `${wsUrl}?token=${token}`;

    console.log("Conectando a WebSocket:", url);

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log("✅ Conexión WebSocket establecida");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const notification: NotificacionWebSocket = JSON.parse(event.data);
          console.log("📩 Notificación recibida:", notification);
          
          // Notificar a todos los listeners
          this.listeners.forEach((listener) => listener(notification));
        } catch (error) {
          console.error("Error al parsear mensaje WebSocket:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("❌ Error en WebSocket:", error);
      };

      this.ws.onclose = (event) => {
        console.log("🔌 Conexión WebSocket cerrada:", event.code, event.reason);
        this.ws = null;

        // Intentar reconexión si no fue un cierre intencional
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => {
            if (this.token) {
              this.connect(this.token);
            }
          }, this.reconnectDelay);
        }
      };
    } catch (error) {
      console.error("Error al crear WebSocket:", error);
    }
  }

  public disconnect(): void {
    if (this.ws) {
      console.log("Cerrando conexión WebSocket...");
      this.ws.close(1000, "Cierre intencional");
      this.ws = null;
      this.token = null;
      this.listeners.clear();
    }
  }

  public addListener(callback: (notification: NotificacionWebSocket) => void): void {
    this.listeners.add(callback);
  }

  public removeListener(callback: (notification: NotificacionWebSocket) => void): void {
    this.listeners.delete(callback);
  }

  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton
export const webSocketService = new WebSocketService();
