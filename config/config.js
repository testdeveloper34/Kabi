'use strict';

module.exports =  {
        SECRET  : 'crm@$12&*01',
        SMTP: {
            service: 'gmail',
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
                user: 'techteamsdn@gmail.com',
                pass: 'tech@sdn'
            }
        },
        RESPONSE_CODES:{
            SUCCESS:200,
            BAD_REQUEST:400,
            ERROR:500
        },
        RESPONSE_MESSAGES:{
            SUCCESS:'successfull!',
            BAD_REQUEST: 'BAD REQUEST!',
            ERROR: 'ERROR OCCURED'
        }
};