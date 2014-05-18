define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');
  var withHogan = require('flight-hogan/lib/with_hogan');

  /**
   * Module exports
   */

  return defineComponent(withHogan, uiChat);

//
  /**
   * Module function
   */

  function uiChat() {
    this.defaultAttrs({
      chatTextBox: '.chat input',
      template : '<li id={{id}}><img src="http://im.api.beatsmusic.com/api/users/{{user_id}}/images/default"><span><b>{{user_name}}</b></span><span>{{message}}</span></li>'
    });

    this.chatAdded = function (evt, msg) {
      var template_data = {
        id : msg.chat.id,
        user_id : msg.chat.user.id || "",
        user_name : msg.chat.user.name || "",
        message : msg.chat.message || ""
      }
      this.$node.find('ul').append(this.renderTemplate(this.attr.template, template_data));
    };

    this.chatRemoved = function (evt, msg) {
      this.$node.find('#' + msg.chat.id).remove();
    };

    this.submitChat = function (evt, msg) {

      var user = JSON.parse(window.localStorage.getItem("user"));

      this.trigger(document, 'uiChatted', {
        chat : {
          user: {
            id: user.user_context,
            name : user.data.username
          },
          message : this.$node.find(this.attr.chatTextBox).val()
        }
      });
      this.$node.find(this.attr.chatTextBox).val('');
    };

    this.keypressChat = function(evt, msg) {
      if (evt && evt.keyCode == 13) {
        this.submitChat(evt, msg);
      }
    };

    this.updateUserData = function(evt, msg) {
      var user = msg.user;
      this.$node.find('.chat img').attr("src", "http://im.api.beatsmusic.com/api/users/" + user.user_context + "/images/default");
    };

    this.after('initialize', function () {
      this.on(document, 'dataChatAdded', this.chatAdded);
      this.on(document, 'dataChatRemoved', this.chatRemoved);

      this.on('submit', {
        'chatTextBox': this.submitChat
      });
      this.on('keypress', {
        'chatTextBox': this.keypressChat
      });

      var user = window.localStorage.getItem("user");
      if (!user) {
        this.on(document, 'dataUserData', this.updateUserData);
      }
      else {
        this.updateUserData(null, { user : JSON.parse(user) });
      }
    });

  }

});
