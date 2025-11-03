import { Directive, Input, ElementRef, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import videojs from 'video.js';
import Hls from 'hls.js';

// npm install videojs-youtube
@Directive({
  selector: '[appVideoPlayer]'
})
export class VideoPlayerDirective implements OnInit, OnDestroy {
  @Input() src: string;
  @Input() poster: string;
  @Input() autoplay = false;
  @Input() controls = false;

  @Output() ready = new EventEmitter<any>();
  @Output() timeUpdate = new EventEmitter<number>();
  @Output() bufferUpdate = new EventEmitter<number>();
  @Output() ended = new EventEmitter<void>();
  @Output() playing = new EventEmitter<void>();
  @Output() paused = new EventEmitter<void>();

  private player: videojs.Player | null = null;
  private videoElement: HTMLVideoElement;
  private lastAllowedTime = 0;

  constructor(private el: ElementRef) {
    this.videoElement = this.el.nativeElement as HTMLVideoElement;
  }

  ngOnInit() {
    if (this.videoElement.tagName.toLowerCase() !== 'video') {
      console.error('appVideoPlayer directive must be placed on a <video> element');
      return;
    }

    this.player = videojs(this.videoElement, {
      autoplay: this.autoplay,
      controls: this.controls, // we’ll hide default controls & use custom
      poster: this.poster,
      preload: 'auto',
      techOrder: ['html5', 'youtube'],
      sources: []
    }, () => this.ready.emit(this.player));

    this.loadSource(this.src);

    this.player.on('timeupdate', () => {
      const ct = this.player.currentTime();
      if (ct > this.lastAllowedTime) this.lastAllowedTime = ct;
      this.timeUpdate.emit(ct);

      const buffered = this.videoElement.buffered;
      if (buffered.length) {
        const end = buffered.end(buffered.length - 1);
        this.bufferUpdate.emit(end);
      }
    });

    this.player.on('seeking', () => {
      const target = this.player.currentTime();
      if (target > this.lastAllowedTime + 0.5) {
        this.player.currentTime(this.lastAllowedTime);
      }
    });

    this.player.on('ended', () => this.ended.emit());
    this.player.on('play', () => this.playing.emit());
    this.player.on('pause', () => this.paused.emit());
  }

  private loadSource(url: string) {
    if (!this.player || !url) return;
    const lower = url.split('?')[0].split('#')[0].toLowerCase();

    if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
      this.player.src({ src: url, type: 'video/youtube' });
    } else if (lower.endsWith('.m3u8')) {
      const canNativePlay = this.videoElement.canPlayType('application/vnd.apple.mpegurl');
      if (canNativePlay) {
        this.player.src({ src: url, type: 'application/vnd.apple.mpegurl' });
      } else if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(this.videoElement);
      } else {
        this.player.src({ src: url, type: 'application/vnd.apple.mpegurl' });
      }
    } else if (lower.endsWith('.mp4')) {
      this.player.src({ src: url, type: 'video/mp4' });
    } else {
      this.player.src({ src: url });
    }
  }

  public seekTo(seconds: number) {
    if (!this.player) return;
    if (seconds <= this.lastAllowedTime) {
      this.player.currentTime(seconds);
    } else {
      this.player.currentTime(this.lastAllowedTime);
    }
  }

  public play() { this.player && this.player.play(); }
  public pause() { this.player && this.player.pause(); }
  public isPlaying(): boolean { return this.player && !this.player.paused(); }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
  }
}
