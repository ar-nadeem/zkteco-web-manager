import { DeviceSettings } from "../apiHandler/types";

export interface User {
    uid: number;
    name: string;
    privilege: number;
    password: string;
    group_id: string;
    user_id: string;
    card: number;
}

export interface UsersDisplayProps {
    data: User[] | null;
    isLoading: boolean;
    error: string | null;
    deviceSettings: DeviceSettings;
    onRefresh?: () => void;
}

export type Users = User[];
