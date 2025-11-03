// dynamic-player.component.ts
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

declare var YT: any;

@Component({
  selector: 'app-dynamic-player',
  template: `
    <!-- HTML5 video -->
    <video
      #htmlVideo
      *ngIf="!isYoutube"
      [src]="videoSrc"
      controls
      (play)="handlePlay()"
      (pause)="handlePause()"
      (ended)="handleEnd()"
      (timeupdate)="handleTimeUpdate($event)"
      width="600"
    ></video>

    <!-- YouTube video -->
    <div #ytContainer *ngIf="isYoutube"></div>
  `,
})
export class DynamicPlayerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() videoSrc!: string; // URL
  @Output() onPlay = new EventEmitter<void>();
  @Output() onTimeUpdate = new EventEmitter<number>();
  @Output() onEnd = new EventEmitter<void>();

  @ViewChild('htmlVideo') htmlVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('ytContainer') ytContainerRef!: ElementRef;

  isYoutube = false;
  private player: any;
  private intervalId: any;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.checkVideoType();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoSrc']) {
      this.checkVideoType();
      if (this.isYoutube) {
        this.loadYoutubePlayer();
      }
    }
  }

  ngOnDestroy(): void {
    this.stopTrackingTime();
  }

  private checkVideoType() {
    this.isYoutube = this.videoSrc.includes('youtube.com') || this.videoSrc.includes('youtu.be');
  }

  /** ---------------------------
   * HTML5 Video Event Handlers
   * --------------------------*/
  handlePlay() {
    this.onPlay.emit();
  }

  handlePause() {
    // nothing for now
  }

  handleEnd() {
    this.onEnd.emit();
  }

  handleTimeUpdate(event: Event) {
    const currentTime = (event.target as HTMLVideoElement).currentTime;
    this.onTimeUpdate.emit(currentTime);
  }

  /** ---------------------------
   * YouTube API Integration
   * --------------------------*/
  private loadYoutubePlayer() {
    if (!(window as any)['YT'] || !(window as any)['YT'].Player) {
      (window as any)['onYouTubeIframeAPIReady'] = () => this.createYoutubePlayer();
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    } else {
      this.createYoutubePlayer();
    }
  }

  private createYoutubePlayer() {
    const videoId = this.extractYoutubeId(this.videoSrc);
    if (!videoId) return;

    this.player = new YT.Player(this.ytContainerRef.nativeElement, {
      videoId: videoId,
      playerVars: { autoplay: 0, controls: 1 },
      events: {
        onStateChange: (event: any) => this.onYoutubeStateChange(event),
      },
    });
  }

  private onYoutubeStateChange(event: any) {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        this.onPlay.emit();
        this.startTrackingTime();
        break;
      case YT.PlayerState.PAUSED:
        this.stopTrackingTime();
        break;
      case YT.PlayerState.ENDED:
        this.onEnd.emit();
        this.stopTrackingTime();
        break;
    }
  }

  private startTrackingTime() {
    this.stopTrackingTime();
    this.intervalId = setInterval(() => {
      this.ngZone.run(() => {
        const currentTime = this.player.getCurrentTime();
        this.onTimeUpdate.emit(currentTime);
      });
    }, 1000);
  }

  private stopTrackingTime() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private extractYoutubeId(url: string): string | null {
    const regExp =
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
  }
}
