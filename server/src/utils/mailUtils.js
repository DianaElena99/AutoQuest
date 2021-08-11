const nodemailer = require('nodemailer');

import {MAIL_ADDR, MAIL_PASSWD } from './config'

export async function sendAccountActivationMail(dest,link){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: MAIL_ADDR,
          pass: MAIL_PASSWD
        }
      });
      
      var mailOptions = {
        from: 'webamster@autoquest.com',
        to: dest,
        subject: 'Confirm Registration',
        html: '<h2>Activate your account so you can use AutoQuest!</h2><br><p> Here is your <a href = "' + link +' "> link </a> '
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
}
