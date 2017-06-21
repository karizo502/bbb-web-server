// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '137199523507691', // your App ID
        'clientSecret'    : 'acb146111089f32faf279e41a6c9cc09', // your App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },

    'twitterAuth' : {
        'consumerKey'        : 'UmTrHhCgqFJmMBRnZkC8yu5Ko',
        'consumerSecret'     : 'uvWmvEmjoH6AxWcO5FUisYKqCHFX6GAAa5Hm2Hgs3I1oGRtqCX',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : '1012015233583-5rmbdm1o7nm25v6hhg0nf1aqv112pn06.apps.googleusercontent.com',
        'clientSecret'     : 'yzmd6DBZ9gQx_X0jqPwe4HKs',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }

};
