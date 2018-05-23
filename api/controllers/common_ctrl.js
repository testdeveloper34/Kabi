'use strict';


module.exports = {
    testGet: testGet
};


function testGet(req, res) {


                res.json({
                    code: req.config.RESPONSE_CODES.SUCCESS,
                    message: req.config.RESPONSE_MESSAGES.SUCCESS,
                });

}
