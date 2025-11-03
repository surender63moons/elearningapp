import { Component, ViewChild, ElementRef, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-video-player-all',
  templateUrl: './video-player-all.component.html',
  styleUrls: ['./video-player-all.component.css']
})
export class VideoPlayerAllComponent {
  src: string='https://youtu.be/g8S81JkATi0';
  poster: string='assets/images/angular.png';

  @ViewChild('videoTag' ) videoTag: ElementRef<HTMLVideoElement>;
  @ViewChild('progressBar') progressBar: ElementRef<HTMLElement>;
  
  duration = 0;
  currentTime = 0;
  bufferedEnd = 0;
  isPlaying = false;
  private lastAllowedTime = 0;
  
  isDragging = false;

  onReady(player) {
    player.on('loadedmetadata', () => { this.duration = player.duration(); });
  }

  onTimeUpdate(time: number) {
    if (!this.isDragging) this.currentTime = time;
    if (time > this.lastAllowedTime) this.lastAllowedTime = time;
  }

  onBufferUpdate(end: number) { this.bufferedEnd = end; }
  onEnded() { this.isPlaying = false; }
  onPlay() { this.isPlaying = true; }
  onPause() { this.isPlaying = false; }

  togglePlayPause() {
    const v = this.videoTag.nativeElement;
    if (v.paused) v.play(); else v.pause();
  }

  onProgressClick(event: MouseEvent) { this.seekFromEvent(event); }

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.seekFromEvent(event);
  }

  @HostListener('document:mousemove', ['$event'])
  onDragMove(event: MouseEvent) {
    if (this.isDragging) this.seekFromEvent(event, false);
  }

  @HostListener('document:mouseup', ['$event'])
  endDrag(event: MouseEvent) {
    if (this.isDragging) {
      this.isDragging = false;
      this.seekFromEvent(event);
    }
  }

  private seekFromEvent(event: MouseEvent, commit: boolean = true) {
    if (!this.duration || !isFinite(this.duration)) return;
    const rect = this.progressBar.nativeElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percent = Math.max(0, Math.min(clickX / rect.width, 1));
    const target = percent * this.duration;

    if (target <= this.lastAllowedTime) {
      if (commit) this.videoTag.nativeElement.currentTime = target;
      this.currentTime = target;
    } else {
      if (commit) this.videoTag.nativeElement.currentTime = this.lastAllowedTime;
      this.currentTime = this.lastAllowedTime;
    }
  }

  formatTime(sec: number): string {
    if (!isFinite(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  }
}