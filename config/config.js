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
            ERROR:500,
            WRONG_CREDENTIALS:420,
            NOT_FOUND: 404,
            NO_CONTENT: 204
        },
        RESPONSE_MESSAGES:{
            SUCCESS:'Successfull!',
            BAD_REQUEST: 'BAD REQUEST!',
            ERROR: 'Server error!',
            WRONG_CREDENTIALS: 'Incorrect Email or pasword!',
            NOT_FOUND: 'Oops! Not found!',
            ITEM_EXIST: 'Oops! Cannot delete category for which item exists, please delete item first!',
            CHILD_EXIST: 'Oops! Cannot delete category for which sub category exists, please delete child categories for this category first!',
            NO_CONTENT: 'No content found!'
        }
};