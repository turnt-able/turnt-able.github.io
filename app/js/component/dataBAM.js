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

    this.setPlaylist = function (evt, msg) {
      console.log(msg);
    };

    this.after('initialize', function () {
      bam = new BeatsAudioManager("myBeatsPlayer");

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
    });
  }

});
