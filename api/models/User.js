/**
 * Author 		:: Aritrik Das <aritrik.cn@gmail.com>
 * Data 		:: 17-04-2014
 * @module      :: User Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    
    attributes  : {
        provider: 'STRING',
        uid: 'INTEGER',
        name: 'STRING',
        email: 'STRING',
        firstname: 'STRING',
        lastname: 'STRING'
    }

};



/*var bcrypt = require('bcrypt');

module.exports = {
    attributes	: {
        provider: {
        	type: 'STRING'
        },
        uid: {
            type: 'INTEGER'
        },
        name: {
            type: 'STRING',
            required: true
        },
        password: {
            type: 'string'
        },
        email: {
            type: 'email',
            required: true,
            unique: true
        },
        firstname: {
            type: 'STRING',
            required: true
        },
        lastname: {
            type: 'STRING',
            required: true
        }
    },
    beforeCreate: function(values, next) {
        bcrypt.hash(values.password,10, function(err, hash) {
			if(err) return next(err);
			values.password = hash;
			next();
        });
    }
};*/