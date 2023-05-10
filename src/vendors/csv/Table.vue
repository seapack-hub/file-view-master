/**
* @author haifeng.zeng
* @date 2023/5/8
* @time 17:44
* @package_name
* @project_name file-view-master
*/
<template>
<div>
<!--  {{value}}-->
  <el-table class="container-table" ref="table" :data="rows" border height="100%" :header-cell-style="{'background':'#778da8','color':'#fff'}">
    <el-table-column v-for="(column, index) in columns" :key="index" :prop="column" :label="column">
      <template slot-scope="scope">
        <div>
          {{ scope.row[column] }}
        </div>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import {readText,csvToArray} from "./util";
export default {
  name: "Table",
  props: {
    value: {
      type: String,
      default:''
    }
  },
  data(){
    return {
      rows: [],
      columns: [],
    }
  },
  watch:{
    value:{
      immediate:true,
      handler(value){
        this.setTable(value);
      }
    }
  },
  methods:{
    setTable(value){
      let data = csvToArray(value);
      for(let i=0;i<data.length;i++){
        if(i==0){
          this.columns = data[i];
        }else{
          let obj = {};
          data[i].forEach((e,index)=>{
            obj[data[0][index]]= e;
          })
          this.rows.push(obj);
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
