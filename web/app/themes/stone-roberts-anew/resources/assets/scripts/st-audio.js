import {Howl, Howler} from 'howler';

let audio = {
  players: Array(),
  init: function() {
    this.reset();
    var playerDoms = document.querySelectorAll(".audio-piece");
    playerDoms.forEach(function(player) {
      this.initPlayer(player);
    }, this);
  },
  reset: function() {
    this.players = Array();
  },
  formatTime: function(secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = secs - minutes * 60 || 0;

    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  },

  setElementWidth: function(element, width) {
    element.style.width = width + "px";
  },

  setSeek: function(player, percent) {
    player.seek(player.duration() * percent);
  },

  seekClick: function(e) {
    // e = Mouse click event.
    var rect = e.currentTarget.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var percent = x / rect.width;
    stAudio.setSeek(this, percent);
    if (!this.playing()) {
      stAudio.setElementWidth(e.currentTarget.querySelector(".span-value"), x);
      //set timer
      e.currentTarget.querySelector(".timer").innerHTML = stAudio.formatTime(Math.round(this.seek()));
    }
    // console.log(x);
  },

  seekHover: function(e) {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    // var y = e.clientY - rect.top; //y position within the element.
    stAudio.setElementWidth(this, x);
  },

  step: function() {
    // Determine our current seek position.
    var seek = this.this.seek() || 0;
    this.timer.innerHTML = stAudio.formatTime(Math.round(seek));
    this.progress.style.width = (seek / this.this.duration() * 100 || 0) + "%";

    // If the sound is still playing, continue stepping.
    if (this.this.playing()) {
      requestAnimationFrame(stAudio.step.bind(this));
    }
  },

  pauseAllPlayers: function() {
    this.players.forEach(function(player) {
      if (player.playing()) {
        player.pause();
      }
    });
  },

  play: function() {
    // only play if not already playing
    if (!this.playing()) {
      stAudio.pauseAllPlayers();
      this.play();
    }
  },

  setAudioEvents: function(audio, player, progress, progressHover, progressWrap) {

    audio.querySelector(".play").addEventListener("click", this.play.bind(player));

    audio.querySelector(".pause").addEventListener("click", function() {
      if (player.playing()) {
        player.pause();
      }
    });

    progressWrap.addEventListener("mousemove", this.seekHover.bind(progressHover));
    progressWrap.addEventListener("click", this.seekClick.bind(player));
  },

  //spin up audio
  initPlayer: function(audio) {
    var url = audio.getAttribute("data-url");
    var duration = audio.querySelector(".duration");
    var timer = audio.querySelector(".timer");
    var progressWrap = audio.querySelector(".progress.span-value-wrap");
    var progress = progressWrap.querySelector(".span-value");
    var progressHover = progress.querySelector(".span-value-jump");
    var player = new Howl({
      src: url,
      loop: false,
      volume: 1,
      preload: true,
			onload: function(){
				// Display the duration.
				duration.innerHTML = stAudio.formatTime(Math.round(player.duration()));
			},
      onplay: function() {
        var data = { this: this, timer: timer, progress: progress };
        // Start upating the progress of the track.
        window.requestAnimationFrame(stAudio.step.bind(data));
      },
    });


    this.players.push(player);

    this.setAudioEvents(audio, player, progress, progressHover, progressWrap);
  },

  stopAllPlayers: function() {
    Howler.unload();
  },
};

export let stAudio = audio;