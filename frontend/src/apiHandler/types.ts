export interface DeviceSettings {
    ip: string;
    port: number;
    password: string;
    force_udp: boolean | false;
    ommit_ping: boolean | false;
    timeout: number | 10;
}


export interface AttendanceSettings {
    office_start?: string;
    office_end?: string;
    grace_period?: number;
}

export interface UserSettings {
    uid: number;
    name: string;
    privilege: number;
    password: string;
    group_id: string;
    user_id: string;
    card: number;
}

export interface Message {
    message: string;
} 