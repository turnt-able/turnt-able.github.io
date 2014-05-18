define(function (require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');

    /**
     * Module exports
     */

    return defineComponent(dataAuth);

    /**
     * Module function
     */

    // fetch value from querystring
    function querystring(key) {
        var re = new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
        var r = [], m;
        while ((m=re.exec(document.location.search)) != null) r.push(m[1]);

        if (r.length > 0) {
            return r[0];
        } else {
            return null;
        }
    }

    function dataAuth() {
        var self = this;

        this.fetchUser = function() {
            var access_token = querystring('access_token');
            if (!access_token) {
                var LOGIN_URL = window.location.host + '/login.html'
                LOGIN_URL += window.storage.genreId ?  "#" + window.storage.genreId : "";
                return window.location = LOGIN_URL;
            }

            $.ajax({
                url: "https://partner.api.beatsmusic.com/v1/api/me",
                crossDomain: true,
                dataType: 'json',
                beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", "Bearer " + access_token);
                    xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
                },
                success: function(data, status) {
                    if (data && data.result) {
                        window.localStorage["user"] = JSON.stringify(data.result);
                        var user_id = data.result.user_context;
                        var user = {};
                        user[user_id] = {
                            vote: 0,
                            data: data.result,
                            //username: data.result.username, // TODO: fetch separately, does not come from /me
                        };
                        window.users.push(user);
                    }
                },
                failure: function(data, status) {
                    console.error(status, data);
                }
            })
        };

        this.after('initialize', function () {
            self.fetchUser();
        });
    }
});
