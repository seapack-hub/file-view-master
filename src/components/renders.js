import { defaultOptions, renderAsync } from "docx-preview";
import renderPptx from "@/vendors/pptx";
import renderSheet from "@/vendors/xlsx";
import renderPdf from "@/vendors/pdf";
import renderImage from "@/vendors/image";
import renderText from "@/vendors/text";
import renderMp4 from "@/vendors/mp4";
import renderCsv from "@/vendors/csv"

// 假装构造一个vue的包装，让上层统一处理销毁和替换节点
const VueWrapper = (el) => ({
  $el: el,
  $destroy() {
    // 什么也不需要 nothing to do
  },
});

//buffer为二进制元素，target为dom目标节点
const handlers = [
  // 使用docxjs支持，目前效果最好的渲染器
  {
    accepts: ["docx"],
    handler: async (buffer, target) => {
      const docxOptions = Object.assign(defaultOptions, {
        debug: true,
        experimental: true,
      });
      await renderAsync(buffer, target, null, docxOptions);
      return VueWrapper(target);
    },
  },
  // 使用pptx2html，已通过默认值更替
  {
    accepts: ["pptx"],
    handler: async (buffer, target) => {
      await renderPptx(buffer, target, null);
      window.dispatchEvent(new Event("resize"));
      return VueWrapper(target);
    },
  },
  // 使用sheetjs + handsontable，无样式
  {
    accepts: ["xlsx"],
    handler: async (buffer, target) => {
      return renderSheet(buffer, target);
    },
  },
  // 使用pdfjs，渲染pdf，效果最好
  {
    accepts: ["pdf"],
    handler: async (buffer, target) => {
      return renderPdf(buffer, target);
    },
  },
  {
    accepts:["csv"],
    handler: async(buffer,target)=>{
      return renderCsv(buffer,target);
    }
  },
  // 图片过滤器
  {
    accepts: ["gif", "jpg", "jpeg", "bmp", "tiff", "tif", "png", "svg"],
    handler: async (buffer, target) => {
      return renderImage(buffer, target);
    },
  },
  // 纯文本预览
  {
    accepts: [
      "txt",
      "json",
      "js",
      "css",
      "java",
      "py",
      "html",
      "jsx",
      "ts",
      "tsx",
      "xml",
      "md",
      "log",
    ],
    handler: async (buffer, target) => {
      return renderText(buffer, target);
    },
  },
  // 视频预览，仅支持MP4
  {
    accepts: ["mp4"],
    handler: async (buffer, target) => {
      renderMp4(buffer, target);
      return VueWrapper(target);
    },
  },
  // 错误处理
  {
    accepts: ["error"],
    handler: async (buffer, target, type) => {
      target.innerHTML = `<div style="text-align: center; margin-top: 80px">不支持.${type}格式的在线预览，请下载后预览或转换为支持的格式</div>
<div style="text-align: center">支持docx, xlsx, pptx, pdf, 以及纯文本格式和各种图片格式的在线预览</div>`;
      return VueWrapper(target);
    },
  },
];

/**
 * reduce()方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。reduce() 对于空数组是不会执行回调函数的。
 * result为初始值，最初为空对象
 * reduce的第二个元素为数组当前元素，将其解构赋值提取出accepts 和 handler
 */
export default handlers.reduce((result, { accepts, handler }) => {
  //遍历accepts数组，将数组中的每个元素作为键，handler作为值，添加到result对象中，并将最终结果返回。
  accepts.forEach((type) => (result[type] = handler));
  return result;
}, {});
