import {Auth} from "./Auth";

/**
 * 用户类
 */
export interface User {
    /**
     * 用户id
     */
    id: number;
    /**
     * 用户名
     */
    name: string;
    /**
     * 用户类型
     */
    auth: Auth;
}