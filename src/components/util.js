import renders from './renders';
import arr from "./renders";

import jschardet from 'jschardet'

/**
 * 使用FileReader对象解析浏览器封装的file文件对象，并返回ArrayBuffer格式数据
 * ArrayBuffer是一种数据类型，用于表示通用的固定长度二进制数据缓冲区
 * @param file
 * @returns {Promise<unknown>}
 */
export async function readBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = loadEvent => resolve(loadEvent.target.result);
    reader.onerror = e => reject(e);
    reader.readAsArrayBuffer(file);
  });
}

export async function readDataURL(buffer) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = loadEvent => resolve(loadEvent.target.result);
    reader.onerror = e => reject(e);
    reader.readAsDataURL(new Blob([buffer]));
  });
}

/**
 * 根据编码方式
 * @param buffer
 * @returns {Promise<unknown>}
 */
export async function readText(buffer) {
  return new Promise((resolve,reject)=>{
    let readerBs64 = new FileReader();
    readerBs64.readAsDataURL(new Blob([buffer]));
    readerBs64.onload = () => {
      let str = atob(readerBs64.result.split(';base64,')[1])
      // 要用二进制格式,获取文件编码
      let encoding = jschardet.detect(str)
      encoding = encoding.encoding;
      console.log('获取文件编码',encoding)
      let reader = new FileReader();
      if(encoding == 'GB2312'){
        reader.readAsText(new Blob([buffer]),'gbk')
      }else{
        reader.readAsText(new Blob([buffer]),encoding)
      }
      reader.onload = (loadEvent)=>{
        const {result} = loadEvent.target;
        resolve(result);
      }
    };
    readerBs64.onerror = e => reject(e);
  })
}

/**
 * 获取文件扩展名
 * @param name 文件名称
 * @returns {string|string|*|string}
 */
export function getExtend(name) {
  const dot = name.lastIndexOf('.')
  return name.substr(dot + 1);
}

/**
 *
 * @param buffer  二进制文件
 * @param type  文件扩展名
 * @param target  放置的dom节点
 * @returns {Promise<*>}
 */
export async function render(buffer, type, target) {
  const handler = renders[type];

  if (handler) {
    return handler(buffer, target);
  }
  return renders.error(buffer, target, type);
}
