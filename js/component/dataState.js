define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');

  /**
   * Module exports
   */

  return defineComponent(dataState);

  /**
   * Module function
   */

  function dataState() {
    var self;
    var storage = {};
    var fb;
    var users;
    var djs;
    var tracks;
    var tracklist;
    var roomVal;
    window.storage = storage;

    this.defaultAttrs({
      fireBaseUrl: 'https://uralgosux.firebaseio.com/'
    });

    this.getGenreId = function () {
      storage.genreId = window.location.hash.split('#')[1];
      return storage.genreId;
    };

    this.sendGenreId = function () {
      var genreId = storage.genreId || this.getGenreId();
      storage.genreId = genreId;
      this.trigger('dataGenreId', { genre: { id: genreId }});
    };

    this.getTurntUp = function (snapshot) {
      if (tracklist.length) {
        self.trigger('dataPlaylistTracks', { tracks : tracklist, saved: true });
      } else {
        $(document).trigger('uiNeedsPlaylist', {
          artist_name: self.getGenreId()
        });
      }
    }

    this.sendTrackList = function () {
    };


    // User Events
    this.userJoined = function (user) {
      var data = user.val();
      data.id = user.name();
      self.trigger('dataUserJoined', { user: data });
    };

    this.userLeft = function (user) {
      var data = user.val();
      data.id = user.name();
      self.trigger('dataUserLeft', { user: data });
    };    

    this.userChanged = function (user) {
      var data = user.val();
      data.id = user.name();
      self.trigger('dataUserChanged', { user: data });
    };


    // DJ Events
    this.djJoined = function (user) {
      self.trigger('dataDJJoined', {
        dj: {
          id: user.name(),
          rating: user.val()
        }
      });
    };

    this.djLeft = function (user) {
      $(document).trigger('dataDJLeft', {
        dj: {
          id: user.name(),
          rating: user.val()
        }
      });
    };    

    this.djChanged = function (user) {
      $('body').trigger('dataDJChanged', {
        dj: {
          id: user.name(),
          rating: user.val()
        }
      });
    };


    this.sendUser = function (evt, msg) {
      users.child(msg.id).val()
    };

    this.sendUserList = function () {
      self.trigger('dataUsers', { users: storage.users });
    };

    this.storeUsers = function (snapshot) {
      storage.users = snapshot.val();
    };

    this.saveRating = function (evt, msg) {
      users.child(msg.user.id + '/vote').set(msg.vote);
    };

    this.saveRoom = function (snapshot) {
      window.roomVal = roomVal = snapshot.val();
      if (typeof tracklist !== 'undefined' && typeof roomVal !== 'undefined') {
        self.getTurntUp();
      }
    };

    this.saveTracks = function (snapshot) {
      window.tracklist = tracklist = snapshot.val() || [];

      if (typeof tracklist !== 'undefined' && typeof roomVal !== 'undefined') {
        self.getTurntUp();
      }
    }

    this.initializeRoom = function (cb) {
      room.set({
        current_track_idx: 0,
        djs: null,
        tracks: null,
        users: null
      }, cb);
    };

    this.after('initialize', function () {
      // This is hacky. Firebase docs are a lie.
      self = this;

      // Create a firebase connection for this instance
      room  = window.room  = new Firebase(this.attr.fireBaseUrl + this.getGenreId());
      
      users  = window.users  = room.child('users');
      djs    = window.djs    = room.child('djs');
      tracks = window.tracks = room.child('tracks');

      users.on('child_added',   this.userJoined);
      users.on('child_removed', this.userLeft);
      users.on('child_changed', this.userChanged);

      djs.on('child_added',   this.djJoined);
      djs.on('child_removed', this.djLeft);
      djs.on('child_changed', this.djChanged);

      tracks.once('value',   this.saveTracks);
      room.once('value', this.saveRoom);

      this.on('uiNeedsGenreId',   this.sendGenreId);
      this.on('uiNeedsTrackList', this.sendTrackList);
      this.on('uiNeedsUserList',  this.sendUserList);
      this.on('uiNeedsUser',      this.sendUser);
      this.on('uiRated',          this.saveRating);

      // this.on('turndownforwhat', this.getTurntUp);
    });
  }

});
