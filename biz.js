var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
const excelHelper = require("./excelHelper");

const _supportedExts = ".xls|.xlsx";
const _emailColTitle = "email", _nameColTitle = "姓名";

var _listing; // 发送列表
var _statusList; // 发送条目状态

// // 操作前端逻辑的帮助对象
// var _feTools;

/* */
function checkFileExt(filename, exts) {
    let pos = filename.lastIndexOf(".");
    if (pos == -1) {
        return false;
    }

    let fileExt = filename.substr(pos);
    let rgx = new RegExp(exts, "i");
    return rgx.test(fileExt);
}

function columnTitleIncludes(columns, title) {
    for (let item of columns) {
        if (item.title == title) {
            return true;
        }
    }

    return false;
}

function validateExcel(sheetInfos) {
    if (sheetInfos[0].data.length == 0) {
        feTools.toastr.error("Excel文件中无数据。");
        return false;
    }

    let columns = sheetInfos[0].columns;
    // if (!columns.includes(_emailColTitle)) {
    if (!columnTitleIncludes(columns, _emailColTitle)) {
        feTools.toastr.error("‘email’列未找到，请使用符合格式的Excel内容。");
        return false;
    }

    //   if (!columns.includes(_nameColTitle)) {
    if (!columnTitleIncludes(columns, _nameColTitle)) {
        feTools.toastr.error("‘姓名’列未找到，请使用符合格式的Excel内容。");
        return false;
    }

    return true;
}

function initSendingStatusColumn(data) {
    let statusList = [];
    for (let i = 0; i < data.length; ++i) {
        var item = data[i];
        //  item.status = "pending";
        statusList.push("pending");
    }

    return statusList;
}


// 生成UI使用的数据，格式为：
/* {
    status, email, details:{...}
}
*/
function createList(rawData) {
    var list = [];
    rawData.map(function (item) {
        var obj = {
            status: "pending",
            email: item.email,
            details: Object.assign({}, item),
        };
        delete obj.details.email;
        list.push(obj);
    });

    return list;
}

function openFile(cb) {
    dialog.showOpenDialog(function (fileNames) {
        if (!fileNames) {
            feTools.toastr.info("未选择文件。");
            return;
        }

        let filename = fileNames[0];
        if (!checkFileExt(filename, _supportedExts)) {
            feTools.toastr.error("请Excel文件（支持扩展名：" + _supportedExts);
            return;
        }

        var excel = excelHelper.readFromFile(fileNames[0], true);

        var valid = validateExcel(excel);
        if (!valid) {
            return;
        }



        let sheet = excel[0];
        //  let statusList = initSendingStatusColumn(sheet.data);

        // let columns = excel[0].data[0];
        // //let data = 
        // let data = [
        //     { "email": "tonydev@foxmail.com", "姓名": "tony day" }
        //     , { "email": "jimmy@foxmail.com", "姓名": "陈正南" }
        //     , { "email": "dora@foxmail.com", "姓名": "刘晓虹" }
        // ];
        _listing = createList(sheet.data);
        // _statusList = statusList;
        cb(sheet.columns, _listing);
    });
}

function send(listing) {
    // console.log("server _listing");
    // console.log(_listing);

    // console.log("biz.js send");

    listing[0].status = "sent";
    listing[1].status = "sending";
    // _statusList[0] = "sent";

    //console.log(_statusList);
}


// document.getElementById("btnReadFile").addEventListener("click", (event) => {
//     dialog.showOpenDialog(function (fileNames) {
//         console.log(fileNames);
//     });
// });

exports.openFile = openFile;
exports.send = send;