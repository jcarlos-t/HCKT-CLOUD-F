import axios from "axios";
import type {
	AxiosRequestConfig,
	AxiosResponse,
	RawAxiosRequestHeaders,
} from "axios";

export type ApiType = "usuarios" | "reportes" | "analitica" | "logs";

export default class Api {
	private static _instances: Map<ApiType, Api> = new Map();
	private static _lastToken: string | null = null;

	private _basePath: string;

	private _authorization: string | null;

	public set authorization(value: string) {
		this._authorization = value;
		Api._lastToken = value;
		// Sincronizar el token en todas las instancias
		Api._instances.forEach((instance) => {
			instance._authorization = value;
		});
	}

	private constructor(basePath: string, authorization: string | null) {
		this._basePath = basePath;
		this._authorization = authorization;
	}

	public static async getInstance(type: ApiType = "usuarios"): Promise<Api> {
		if (!Api._instances.has(type)) {
			let basePath: string;
			
			if (type === "usuarios") {
				basePath = import.meta.env.VITE_API_USUARIOS || "";
			} else if (type === "reportes") {
				basePath = import.meta.env.VITE_API_REPORTES || "";
			} else if (type === "analitica") {
				basePath = import.meta.env.VITE_API_ANALITICA || "";
			} else if (type === "logs") {
				basePath = import.meta.env.VITE_API_LOGS || "";
			} else {
				basePath = "";
			}

			if (!basePath) {
				throw new Error(
					`Variable de entorno VITE_API_${type.toUpperCase()} no configurada`
				);
			}

			// Si hay un token guardado, usarlo para la nueva instancia
			const instance = new Api(basePath, Api._lastToken);
			Api._instances.set(type, instance);
		}

		return Api._instances.get(type)!;
	}

	public static getWebSocketUrl(): string {
		const wsUrl = import.meta.env.VITE_API_WEBSOCKETS || "";
		if (!wsUrl) {
			throw new Error("Variable de entorno VITE_API_WEBSOCKETS no configurada");
		}
		return wsUrl;
	}

	public async request<RequestType, ResponseType>(config: AxiosRequestConfig) {
		const headers: RawAxiosRequestHeaders = {
			"Content-Type": "application/json",
			Authorization: this._authorization ? `Bearer ${this._authorization}` : "",
		};

		const configOptions: AxiosRequestConfig = {
			...config,
			baseURL: this._basePath,
			headers: headers,
		};

		const path = this._basePath + config.url;

		// Trazas: Log de la petición
		console.group(`API Request [${config.method?.toUpperCase() || "GET"}]`);
		console.log("URL:", path);
		console.log("Method:", config.method?.toUpperCase() || "GET");
		console.log("Headers:", headers);
		if (config.data) {
			console.log("Request Body:", config.data);
		}
		if (config.params) {
			console.log("Query Params:", config.params);
		}
		console.groupEnd();

		try {
			const response = await axios<RequestType, AxiosResponse<ResponseType>>(
				path,
				configOptions
			);

			// Trazas: Log de la respuesta exitosa
			console.group(`API Response [${config.method?.toUpperCase() || "GET"}]`);
			console.log("URL:", path);
			console.log("Status:", response.status, response.statusText);
			console.log("Response Data:", response.data);
			console.log("Response Headers:", response.headers);
			console.groupEnd();

			return response;
} catch (error: any) {
  // Trazas: Log del error
  console.group(`API Error [${config.method?.toUpperCase() || "GET"}]`);
  console.log("URL:", path);
  if (error.response) {
    console.log("Status:", error.response.status, error.response.statusText);
    console.log("Error Response Data:", error.response.data);
    console.log("Error Response Headers:", error.response.headers);
  } else if (error.request) {
    console.log("Request made but no response received");
    console.log("Request:", error.request);
  } else {
    console.log("Error setting up request:", error.message);
  }
  console.log("Full Error:", error);
  console.groupEnd();

  const status = error?.response?.status;
  if (status === 401 || status === 403 || status === 404) {
    // Notificar al AuthContext que limpie la sesión
    window.dispatchEvent(new Event("session:cleared"));

    // Opcional: forzar navegación a login si no estamos ya ahí
    if (window.location.pathname !== "/auth/login") {
      window.location.href = "/auth/login";
    }
  }

  throw error;
}

	}

	public get<RequestType, ResponseType>(config: AxiosRequestConfig) {
		const configOptions: AxiosRequestConfig = {
			...config,
			method: "GET",
		};

		return this.request<RequestType, ResponseType>(configOptions);
	}

	public post<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig,
	) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "POST",
			data,
		};

		return this.request<RequestBodyType, ResponseBodyType>(configOptions);
	}

	public delete(options: AxiosRequestConfig) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "DELETE",
		};

		return this.request<void, void>(configOptions);
	}

	public put<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig,
	) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "PUT",
			data: data,
		};

		return this.request<RequestBodyType, ResponseBodyType>(configOptions);
	}

	public patch<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig,
	) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "PATCH",
			data: data,
		};

		return this.request<RequestBodyType, ResponseBodyType>(configOptions);
	}
}