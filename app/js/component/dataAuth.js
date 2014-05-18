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

        this.getAccessToken = function() {
            var access_token = querystring('access_token');
            if (!access_token) {
                access_token = window.localStorage.getItem('access_token');
            }
            if (!access_token) {
                var LOGIN_URL = window.location.host + '/login.html'
                LOGIN_URL += window.storage.genreId ?  "#" + window.storage.genreId : "";
                return window.location.href = LOGIN_URL;
            }
            else {
                window.localStorage['access_token'] = access_token;
            }

            return access_token;
        };

        this.fetchUser = function(evt, msg) {

            var access_token = this.getAccessToken();

            if (!access_token) return;

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
                        self.fetchUserData();
                    }
                },
                failure: function(data, status) {
                    console.error(status, data);
                }
            });
        };

        this.fetchUserData = function(evt, msg) {
            var access_token = this.getAccessToken();

            if (!access_token) return;

            var user = JSON.parse(window.localStorage["user"]);

            if (!user) return;

            $.ajax({
                url: "https://partner.api.beatsmusic.com/v1/api/users/" + user.user_context,
                crossDomain: true,
                dataType: 'json',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + access_token);
                    xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
                },
                success: function(data, status) {
                    if (data && data.data) {
                        window.localStorage["user"]['data'] = JSON.stringify(data.data);
                        var user_id = data.data.id;
                        var user = {};
                        user[user_id] = {
                            vote: 0,
                            data: data.data,
                            id : user_id,
                            username: data.data.username
                        };
                        window.users.update(user);
                        self.broadCast(data);
                    }
                },
                failure: function(data, status) {
                    console.error(status, data);
                }
            });
        };

        this.broadCast = function(data) {
            this.trigger(document, 'dataUserData', { user : data });
        };

        this.after('initialize', function () {
            this.on('uiNeedsAuth', this.fetchUser);
            this.on('uiNeedsUserData', this.fetchUserData);
        });
    }
});
