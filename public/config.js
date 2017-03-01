const smtp = require("./lib/smtp.js");

$(function () {
    new Vue({
        el: "#main",
        data: {
            config: {
                smtp: {
                    host: "smtp.qq.com",
                    port: 465,
                    user: "480159@qq.com",
                    pass: "5696.1120",
                },
                savePassword: true,
                sender: {
                    name: "tony day",
                    subject: "ABC公司工资通知单（{year}年{month}月"
                },

            },
            testReceiver: "", // receiver for sending test mail
        },
        methods: {
            save() {
                sessionStorage.setItem("password", "abc123.");
                toastr.success("已保存。");
            },
            sendTestMail() {
                console.log("sending....");
                let mail = {
                    from: `mail test<${this.config.smtp.user}>`,
                    to: this.testReceiver,
                    subject: "a test mail by Salary Slip Sender",
                    html: "如果您看到这封邮件，说明您的SMTP正确，并可以成功发送邮件。",
                };
                smtp.send(mail, this.config.smtp, function (info) {
                    console.log(info);
                });
            }
        }
    });
});