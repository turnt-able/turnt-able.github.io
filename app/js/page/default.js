define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */
  var DataState = require('component/dataState');
  var PlaylistMaker = require('component/playlistMaker');
  var UIDj = require('component/uiDj');
  var UIUser = require('component/uiUser');
  var UIRating = require('component/uiRating');
  var UIMarquee = require('component/uiMarquee');
  var DataBAM = require('component/dataBAM');
  var DataAuth = require('component/dataAuth');

  /**
   * Module exports
   */

  return initialize;

  /**
   * Module function
   */

  function initialize() {
    DataBAM.attachTo(document);
    UIDj.attachTo('#djs');
    UIUser.attachTo('#users');
    UIRating.attachTo('#rate-box');
    UIMarquee.attachTo(document);

    var user = window.localStorage.getItem("user");
    if (!user) {
        var DataAuth = require('component/dataAuth');
        DataAuth.attachTo(document);
    }
    PlaylistMaker.attachTo(document);

    DataState.attachTo(document,  {
      fireBaseUrl: 'https://uralgosux.firebaseio.com/'
    });

    setTimeout(function () {
      $(document).trigger('turndownforwhat');
    }, 100);

    // // test playlist
    // $(document).on('dataPlaylistTracks', function(event, msg) {
    //   // $('body').html('<pre>' + JSON.stringify(msg, null, '\t') + '</pre>');
    //   console.dir(msg);
    // });
    // $(document).trigger('uiNeedsPlaylist', { artist_name : 'Weezer' });

  }

});
