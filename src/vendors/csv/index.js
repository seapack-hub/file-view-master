import Vue from 'vue';
import Table from './Table';
import {readText} from "@/components/util.js";
import ElementUI from 'element-ui'; // 2.1引入结构
import 'element-ui/lib/theme-chalk/index.css'; // 2.2引入样式
Vue.use(ElementUI); // 3.安装

export default async function renderCsv(buffer, target) {
    const table  = await readText(buffer);
    return new Vue({
        render: h => h(Table, { props: { value: table } }),
    }).$mount(target)
}
