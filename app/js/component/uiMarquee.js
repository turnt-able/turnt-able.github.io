define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');

  /**
   * Module exports
   */

  return defineComponent(uiMarquee);

  /**
   * Module function
   */

  function uiMarquee() {
    this.defaultAttrs({

    });


    var letters_red = null, 
      sMessage = "", 
      canvas = null, 
      ctx = null, 
      LETTER_HEIGHT = 350, 
      LETTER_WIDTH = 266.7, 
      iStep = 0, 
      iDrawPhase = 0, 
      job = null;
    
    function drawLetter(iSpriteRow, iSpriteCol,  iPos) {
      var xPos = (LETTER_WIDTH * iPos) - iStep;
      if ((xPos > 0 - LETTER_WIDTH) && (xPos < 1200 + LETTER_WIDTH)) {
        ctx.drawImage(letters_red,  iSpriteCol * LETTER_WIDTH, iSpriteRow, LETTER_WIDTH, LETTER_HEIGHT, xPos, 0, LETTER_WIDTH, LETTER_HEIGHT);
      }
    }
    
    function draw() {
      var iCounter = 0, 
        iCharCode = 0;
      for ( iCounter = 0; iCounter < sMessage.length; iCounter++) {
        iCharCode = sMessage.charCodeAt(iCounter);
        if (iCharCode > 64 && iCharCode < 91) {
          iSpriteCol = Math.abs(65 - iCharCode) ;
          iSpriteRow = 0;
        } else {
          iSpriteCol = 26;
          iSpriteRow = 0; 
        }
        drawLetter(iSpriteRow, iSpriteCol, iCounter);
      }
      iSpriteCol = 1;
      iSpriteRow = 5;
      for (iCounter; iCounter < sMessage.length; iCounter++) {
        drawLetter(iSpriteCol, iSpriteRow, iCounter);
      }
      iDrawPhase += 1;
      iStopPoint = (8 * sMessage.length);
      console.log('stop:'+iStopPoint);
      console.log('draw:'+iDrawPhase);
      if (iDrawPhase < iStopPoint) {
        iStep += 38.2;
      } else {
        clearInterval(job);
        startAnim();
      }
    }
    
    function startAnim() {
      clearInterval(job);
      sMessage = document.getElementById('text').value.toUpperCase();
      iDrawPhase = 0;
      iStep = 0;
      // Add 5 spaces padding so the text start off right
      sMessage = "    " + sMessage;
      // Start the timer
      job = setInterval(draw, 100);
    }
    
    function init() {
      canvas = document.getElementById('led');
      if (canvas.getContext('2d')) {
        ctx = canvas.getContext('2d');
        letters_red = new Image();
        letters_red.src = 'img/letters-red.jpg?v=1';
        letters_red.onload = startAnim;
      } else {
        alert("Canvas not supported!");
      }
    }

    this.after('initialize', function () {
      // init();
    });
  }

});
