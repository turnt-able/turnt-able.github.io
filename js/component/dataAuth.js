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
                var LOGIN_PATH = '/login.html';
                return window.location.pathname = LOGIN_PATH;
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
                        user.data = data.data;
                        window.localStorage["user"] = JSON.stringify(user);
                        var user_id = data.data.id;
                        var user_data = {};
                        user_data[user_id] = {
                            vote: 0,
                            data: data.data,
                            id : user_id,
                            username: data.data.username
                        };
                        window.users.update(user_data);
                        self.userRef = window.users.child(user_id);
                        self.userRef.onDisconnect().remove();
                        self.broadCast(data);
                    }
                },
                failure: function(data, status) {
                    console.error(status, data);
                }
            });
        };

        this.broadCast = function(data) {
            $(document).trigger('dataUserData', { user : data });
        };

        this.updateExistence = function(evt, msg) {
            var online = msg.online;
            if (online && this.userRef) {
                self.userRef.onDisconnect().remove();
            }
        };

        this.after('initialize', function () {
            this.on('uiNeedsAuth', this.fetchUser);
            this.on('uiNeedsUserData', this.fetchUserData);
            this.on('dataPresence', this.updateExistence);
        });
    }
});
