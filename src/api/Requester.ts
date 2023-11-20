import axios from 'axios'
import {md5Hex} from "./CryptoUtils";
import {User} from "../entities/User.ts";
import {Auth} from "../entities/Auth.ts";
import {UnwrapRef} from "vue";

export const baseUrl = 'https://localhost:8081';

export interface Result<T> {
    data: T;
    message: string;
    status: number;
    timestamp: number
}

export interface Page<T> {
    data: T[];
    total: number;
}

export interface File {
    page: number;
    num: number;
}

export type PageResult<T> = Result<Page<T>>
const instance = axios.create({
    baseURL: baseUrl,
    timeout: 1000,
    headers: {'Content-Type': 'application/json'}
});
axios.interceptors.request.use(function (config) {
    config.headers['Authorization'] = window.sessionStorage.getItem("authorization");
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    const authorization = response.headers['Set-Authorization'];
    if (authorization) {
        window.sessionStorage.setItem("authorization", authorization);
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});
export const login = (username: string, password: string) => {
    return instance.post<Result<User>>("/api/user/login", {
        name: username,
        password: md5Hex(password)
    })
}
export const register = (username: string, password: string, auth: Auth, verifyCode?: string) => {
    return instance.post<Result<User>>("/api/user/register", {
        name: username,
        password: md5Hex(password),
        auth: auth,
        verifyCode: verifyCode,
    })
}

export const getAllFiles = (page: UnwrapRef<number>, num: UnwrapRef<number>) => {
    return instance.get<PageResult<File>>(`/api/file/getAll?page=${page}&num=${num}`);
}