'use strict';

module.exports =  {
        SECRET  : 'crm@$12&*01',       
        //webUrl: 'http://localhost:5072',
        webUrl: 'http://52.34.207.5:5072',
        // webUrl: 'http://52.44.204.22',
        STRIPEKEY: 'sk_test_fUWjMy9xlRoy5v49vA8GBRbV',/*test account Smartdata*/
        // STRIPEKEY: 'sk_test_p4T492k0DwwT9t7leL26eOAo',/*test account client's*/
        //STRIPEKEY: 'sk_test_9xVlngLAYG7rHIdLm2uLU5V6',/*Live account client's*/
        //DIR_NAME: '/app',
        SMTP: {
            service: 'gmail',
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
                user: 'techteamsdn@gmail.com',
                pass: 'tech@sdn'
            }
        }
};