require("dotenv").config();
const helper = require('sendgrid').mail;

function Notify(content, toEmail) {
    this.fromEmail = new helper.Email('admin@parksocial.com');
    this.subject = 'Park Social Notifications';
    this.content = content;
    this.toEmail = toEmail;
    this.mail = new helper.Mail(this.fromEmail, this.subject, this.toEmail, this.content);
}


Notify.prototype.sendEmail = function () {
    let sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    let request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: this.mail.toJSON()
    });

    sg.API(request, function (error, response) {
        if (error) {
            console.log('Error response received');
        }
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });
};

module.exports = Notify;