import {Auth} from "./Auth";

export interface User {
    id: string
    name: string;
    auth: Auth;
}