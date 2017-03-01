const nodemailer = require("nodemailer");

module.exports.test = function () {
    console.log("smtp test");
};

module.exports.send = function (mail, config, callback) {

    console.log(mail);
    console.log(config);
    // create reusable transporter object using the default SMTP transport
    // let transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'gmail.user@gmail.com',
    //         pass: 'yourpass'
    //     }
    // });

    let transporter = nodemailer.createTransport({
        port: config.port,
        host: config.host,
       // secure: true,
        auth: {
            user: config.user,
            pass: config.pass,
        }
    });
    // // setup email data with unicode symbols
    // let mailOptions = {
    //     from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
    //     to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
    //     subject: 'Hello ✔', // Subject line
    //     text: 'Hello world ?', // plain text body
    //     html: '<b>Hello world ?</b>' // html body
    // };

    // send mail with defined transport object
    console.log("being send");

    // transporter.verify(function (error, success) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Server is ready to take our messages');
    //     }
    // });
    // return;

    transporter.sendMail(mail, (error, info) => {
        if (error) {
            throw error;
        }

        console.log("sent");
        callback(info);
        // console.log('Message %s sent: %s', info.messageId, info.response);
    });
};