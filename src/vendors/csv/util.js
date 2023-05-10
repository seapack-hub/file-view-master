//转换ArrayBuffer类型数据

export function  csvToArray(csv){
    let table = [];
    //将字符串以换行符隔开。
    let allRows = csv.split(/\r\n/);
    for(let i=0; i<allRows.length; i++){
        if(allRows[i] != ""){
            table.push(allRows[i].split(","));
        }
    }
    return table;
}

