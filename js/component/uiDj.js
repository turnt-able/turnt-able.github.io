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

  return defineComponent(withHogan, dj);

  /**
   * Module function
   */

  function dj() {
    var djs = {};

    this.defaultAttrs({
      'template': '<div class="dj" id={{id}}><img class="person" src="img/person_{{id}}.png"/><img class="laptop" src="img/laptop-{{id}}.png"/></div>',
    });

    this.addDJ = function (evt, msg) {
      djs[msg.dj.id] = msg.dj;
      this.$node.append(this.renderTemplate(this.attr.template, msg.dj));
    };

    this.removeDJ = function (evt, msg) {
      delete djs[msg.dj.id];
      this.$node.find('#' + msg.dj.id).remove();
    };

    this.activateDJ = function (evt, msg) {
      var $djs = this.$node.find('.dj');
      $djs.find('.bounce').removeClass('bounce');
      this.$node.find('#' + msg.dj.id + ' .person').addClass('bounce');
      window.currentDJID = msg.dj.id;
    };

    this.after('initialize', function () {
      this.on(document, 'dataDJJoined',    this.addDJ);
      this.on(document, 'dataDJLeft',      this.removeDJ);
      this.on(document, 'dataDJActivated', this.activateDJ);
    });
  }

});
