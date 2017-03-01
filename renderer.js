// var remote = require('remote'); // Load remote compnent that contains the dialog dependency
// var dialog = remote.require('dialog'); // Load the dialogs component of the OS
var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)


// function openFile(cb) {
//     dialog.showOpenDialog(function (fileNames) {
//         console.log(fileNames);
//         let columns = ["#", "email", "姓名"];
//         cb(columns);
//     });
// }
// // document.getElementById("btnReadFile").addEventListener("click", (event) => {
// //     dialog.showOpenDialog(function (fileNames) {
// //         console.log(fileNames);
// //     });
// // });

// exports.openFile = openFile;

document.getElementById("node-fn-btn").addEventListener("click", function(){
    console.log("node function 2");   
    var password = app.getGlobal("sharedObject");
    // /console.log();//.password;
    console.log(password);
})

function callFeLogic(feTools) {
    feTools.toastr.info("called by node");
}

function nodeFn () {
 console.log("node function");   
}