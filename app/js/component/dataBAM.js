define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');

  /**
   * Module exports
   */

  return defineComponent(dataBAM);

  /**
   * Module function
   */

  function dataBAM() {

    var bam;

    this.defaultAttrs({});

    var placeholder = function(value) {};

    this.handleReady  = function(value) {

    };

    this.handleError = function(value) {

    };

    this.handleConnectionSuccess = placeholder;
    this.handleConnectionClosed = placeholder;
    this.handleCanPlay = placeholder;
    this.handlePlay = placeholder;
    this.handlePause = placeholder;
    this.handlePaused = placeholder;
    this.handlePlaying = placeholder;
    this.handleStop = placeholder;
    this.handleEnded = placeholder;
    this.handleStalled = placeholder;
    this.handleDurationChange = placeholder;
    this.handleLoadedMetadata = placeholder;
    this.handleTimeUpdate = placeholder;

    this.handleLoadRequest = function(event, msg) {
      bam.load(msg.trackId, msg.autoplay);
    };

    this.handlePauseRequest = function(event, msg) {
      bam.pause();
    };

    this.handlePlayRequest = function(event, msg) {
      bam.play();
    };

    this.handleStopRequest = function(event, msg) {
      bam.stop();
    };

    this.setIndex = function (evt, msg) {
      window.roomVal.current_track_idx = msg.index;
      this.pickupCurrentPlayContext(tracklist);
    };

    this.pickupCurrentPlayContext = function (tracks) {
      var token = window.localStorage.getItem('access_token');
      var user = JSON.parse(window.localStorage.getItem('user'));
      var track = tracks[window.roomVal.current_track_idx];
      bam.stop();
      bam.authentication = {
        access_token: token,
        user_id: user.user_context
      };
      bam.clientId = user.client_id;
      bam.identifier = track.track.id;
      bam.load();
      this.trigger(document, 'dataDJActivated', { dj: { id: track.dj }});
      this.trigger(document, 'dataTrack', { track: track.track });
    };

    this.setPlaylist = function (evt, msg) {
      if (!msg.saved) {
        tracks.set(msg.tracks, function () {
          this.pickupCurrentPlayContext(msg.tracks);
        });
      } else {
        this.pickupCurrentPlayContext(msg.tracks);
      }
    };

    this.nextTrack = function () {
      var i = window.roomVal.current_track_idx + 1;
      window.room.child('current_track_idx').set(i);
    };

    this.after('initialize', function () {
      bam = new BeatsAudioManager("myBeatsPlayer");
      window.bam = bam;

      bam.on('ready', this.handleReady);
      bam.on('connectionsuccess', this.handleConnectionSuccess);
      bam.on('connectionclosed', this.handleConnectionClosed);
      bam.on('canplay', this.handleCanPlay);
      bam.on('play', this.handlePlay);
      bam.on('pause', this.handlePause);
      bam.on('paused', this.handlePaused);
      bam.on('playing', this.handlePlaying);
      bam.on('stop', this.handleStop);
      bam.on('ended', this.handleEnded);
      bam.on('stalled', this.handleStalled);
      bam.on('durationchange', this.handleDurationChange);
      bam.on('loadedmetadata', this.handleLoadedMetadata);
      bam.on('timeupdate', this.handleTimeUpdate);
      bam.on('error', this.handleError);

      this.on('uiLoadRequest', this.handleLoadRequest);
      this.on('uiPauseRequest', this.handlePauseRequest);
      this.on('uiPlayRequest', this.handlePlayRequest);
      this.on('uiStopRequest', this.handleStopRequest);

      this.on(document, 'dataPlaylistTracks', this.setPlaylist);
      this.on(document, 'uiHatedThisTrack', this.nextTrack);
      this.on(document, 'dataTrackIndex', this.setIndex);
    });
  }

});
