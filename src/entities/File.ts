/**
 * 文件类
 */
export interface File {
    /**
     * 下载数
     */
    downloadCount: number;
    /**
     * 文件hash（sha512）
     */
    hash: string;
    /**
     * 文件id
     */
    id: number;
    /**
     * 文件名
     */
    name: string;
    /**
     * 文件大小（字节为单位）
     */
    size: number;
    /**
     * 文件类型
     */
    type: string;
    /**
     * 上传时间
     */
    uploadTime: string;
    /**
     * 上传者名称
     */
    uploaderName: string;
}