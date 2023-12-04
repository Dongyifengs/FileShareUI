import axios from 'axios'
import {UploadRequestOptions} from "element-plus"
import {UploadProgressEvent} from "element-plus/es/components/upload/src/upload";
import {md5Hex} from "./CryptoUtils";
import {User} from "../entities/User";
import {Auth} from "../entities/Auth";
import {File} from "../entities/File";
import {SearchType} from "../entities/SearchType.ts";
import {AccessInformation} from "../entities/AccessInformation.ts";

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
instance.interceptors.request.use(function (config) {
    config.headers['Authorization'] = window.sessionStorage.getItem("authorization");
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    const authorization = response.headers['set-authorization'];
    if (authorization) {
        window.sessionStorage.setItem("authorization", authorization);
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});
/**
 * 登录接口
 * @param username 用户名
 * @param password 密码（未加密的）
 */
export const login = (username: string, password: string) => {
    return instance.post<Result<User>>("/api/user/login", {
        name: username,
        password: md5Hex(password)
    })
}
/**
 * 注册接口
 * @param username 用户名
 * @param password 密码
 * @param auth 注册的权限（Auth.user或Auth.admin）
 * @param verifyCode 注册管理员所需的验证码（若注册的权限为Auth.user则无需填写）
 */
export const register = (username: string, password: string, auth: Auth, verifyCode?: string) => {
    return instance.post<Result<User>>("/api/user/register", {
        name: username,
        password: md5Hex(password),
        auth: auth,
        verifyCode: verifyCode,
    })
}
/**
 * 获取验证码（只能以管理员用户运行，后端会验签）
 */
export const generatorVerifyCode = () => {
    return instance.get<Result<string>>("/api/user/verifyCode")
}

/**
 * 获取所有文件
 * @param page 页数
 * @param num 一页多少文件
 */
export const getAllFiles = (page: number, num: number) => {
    return instance.get<PageResult<File>>("/api/file/getAll", {params: {num, page}});
}
/**
 * 上传文件接口
 * @param options 上传选项（会在el-upload的http-request方法调用时传入）
 * @param controller 取消控制器（自己创建后传入）
 */
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
/**
 * 获取下载链接
 * @param id 文件id
 */
export const getLink = (id: number) => {
    return instance.get<Result<string>>("/api/file/link", {params: {id}});
}
/**
 * 删除文件
 * @param id 文件id
 */
export const remove = (id: number) => {
    return instance.post<Result<boolean>>("/api/file/remove", {id});
}
const handlerSearchType = (searchType: SearchType): string => {
    switch (searchType){
        case SearchType.ID:
            return "ID"
        case SearchType.TYPE:
            return "TYPE"
        case SearchType.UPLOAD_DAY:
            return "UPLOAD_DAY"
        case SearchType.UPLOADER:
            return "UPLOADER"
        default:
            return "FILE_NAME"
    }
}
/**
 * 搜索
 * @param page 页数
 * @param num 一页多少文件
 * @param searchType 搜索类型
 * @param data 搜索数据
 */
export const search = (page: number, num: number, searchType: SearchType, data: string) => {
    return instance.get<PageResult<File>>("/api/file/search", {params: {page, num, type: handlerSearchType(searchType), data}});
}
/**
 * 获取访问情况
 * @param count 获取的天数
 */
export const getAccessInformation = (count: number) => {
    return instance.get<AccessInformation[]>("/api/access/get", {params: {count}});
}
/**
 * 获取总访问情况
 */
export const getTotalAccessInformation = () => {
    return instance.get<AccessInformation>("/api/access/getAll");
}
/**
 * 检查是否可以上传
 * @param filename 文件名
 */
export const checkUpload = (filename: string) => {
    return instance.get<Result<boolean>>("/api/file/checkUpload", {params: {filename}});
}