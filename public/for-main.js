"use strict";
var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

const biz = require("./biz");

var feTools = {
    toastr: toastr
};


function openFile33(cb) {
    dialog.showOpenDialog(function (fileNames) {
        console.log(fileNames);
        let columns = ["email", "姓名"];
        let data = [
            { "email": "tonydev@foxmail.com", "姓名": "tony day" }
            , { "email": "jimmy@foxmail.com", "姓名": "陈正南" }
            , { "email": "dora@foxmail.com", "姓名": "刘晓虹" }
        ];
        cb(columns, data);
    });
}


$(function () {
    new Vue({
        el: "#main",
        data: {
            columns: []
            , listing: []
            , statusList: []
        },
        methods: {
            openFile: function () {
                let me = this;
                biz.openFile(function (columns, data) {
                    me.columns = columns;
                    me.listing = data;
                    //      me.statusList = statusList;

                    // console.log(me.columns);
                    console.log(me.listing);
                    //  console.log(me.statusList);
                });
            }
            , test: function () {
                console.log(toastr);
                toastr.info("test");
            }
            , send: function () {
                biz.send(this.listing, this.statusList);
                this.statusList[0] = "haha";
                //   console.log(this.statusList);
            },
            addNewRow() {
                let item = {
                    email: "danny",

                }
                this.listing.push(item);
            },
            updateData() {
                this.listing[0].status = "email changed";
            },
        }
    })
});