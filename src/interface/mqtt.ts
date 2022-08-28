export interface mqttConnectData {
    host: string,
    port: number,
    clientid: string,
    username: string,
    password: string,
}

export interface mqttOption {
    username: string,
    password: string,
    rejectUnauthorized: boolean
}

export interface payload {
    topic: string;
    message: any;
}