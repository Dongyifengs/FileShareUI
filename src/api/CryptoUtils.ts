import CryptoJs from "crypto-js";

/**
 * md5加密为16进制字符串
 * @param content 需要加密的内容
 * @return 加密后的16进制字符串
 */
export const md5Hex = (content: string): string => {
    return CryptoJs.MD5(content).toString(CryptoJs.enc.Hex);
}