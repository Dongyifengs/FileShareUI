import axios from 'axios'
import {UploadRequestOptions} from "element-plus"
import {UploadProgressEvent} from "element-plus/es/components/upload/src/upload";
import {md5Hex} from "./CryptoUtils";
import {User} from "../entities/User";
import {Auth} from "../entities/Auth";
import {File} from "../entities/File";

export const baseUrl = 'http://localhost:8081';

export interface Result<T> {
    data: T;
    message: string;
    status: number;
    timestamp: number
}

export interface Page<T> {
    data: Array<T>;
    total: number;
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

// 获取文件
export const getAllFiles = (page: number, num: number) => {
    return instance.get<PageResult<File>>("/api/file/getAll", {params: {num, page}});
}

// 上传文件
export const upload = (options: UploadRequestOptions, controller: AbortController) => {
    const param = new FormData();
    param.append("file", options.file);
    return instance.post("/api/file/upload", param, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        timeout: 0,
        onUploadProgress: (evt) => {
            const progressEvent: ProgressEvent = evt.event as ProgressEvent;
            const uploadEvent: UploadProgressEvent = progressEvent as UploadProgressEvent;
            uploadEvent.percent = (evt.progress as number) * 100;
            options.onProgress(uploadEvent);
        },
        signal: controller.signal
    })
}