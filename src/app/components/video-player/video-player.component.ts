import { Component, Input, ElementRef, ViewChild, OnInit, OnDestroy,OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProgressService, ProgressUpdateRequest } from '../../services/progress.service';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from "ngx-toastr";
import { McqTestComponent } from '../../components/mcq-test/mcq-test.component';

declare var YT: any;
@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  // @Input() contentId: number;
  // @Input() videoFilename: string;
   contentId: number;
   videoFilename: string;

  @ViewChild('videoPlayer') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('playerContainer') playerContainer!: ElementRef;  

  private player!: any;
  private intervalId: any;

  videoUrl: SafeUrl;
  videofiletype: string;
  isLoading = true;
  currentTime = 0;
  duration = 0;
  progress = 0;
  isPlaying = false;
  volume = 1;
  youtubeEmbedUrl:any;
  isyoutube:boolean=false;
  private progressInterval: any;
  private updateInterval: any;
  currentUser:any;
  lastAllowedTime=0;
   playerId = 'yt-player-' + Math.random().toString(36).substring(2);
  ytPlayer: any;
isVideoCompleted = false;
  constructor(
    private videoService: VideoService,private progressService: ProgressService,private zone: NgZone,
    private sanitizer: DomSanitizer,private route: ActivatedRoute,private authService: AuthService,public toastr: ToastrService 
  ) {}



  showMCQTest() {
    debugger;
    this.isVideoCompleted = true;
  }

  ngOnInit() {
  
      this.authService.currentUser.subscribe(user => {
       debugger;
      this.currentUser = user;
    });

      this.route.queryParams.subscribe(params =>{
        debugger;
        this.contentId=params["id"]; 
        this.videoFilename=params["contentUrl"];
        this.videofiletype=params["contentType"];
           this.loadVideo();
      })   

  }

// createPlayer() {
//   debugger;
//     this.player = new YT.Player(this.playerContainer.nativeElement, {
//       videoId: this.extractVideoId(this.videoFilename), // Replace with your video ID
//       playerVars: {
//         autoplay: 0,
//         controls: 1,
//       },
//       events: {
//         onReady: (event: any) => this.onPlayerReady(event),
//         onStateChange: (event: any) => this.onPlayerStateChange(event),
//       },
//     });
//   }

  onPlayerReady(event: any) {
    console.log('Player is ready');
  }

  // onPlayerStateChange(event: any) {
  //   switch (event.data) {
  //     case YT.PlayerState.PLAYING:
  //       console.log('onplay');
  //       this.startTrackingTime();
  //       break;
  //     case YT.PlayerState.PAUSED:
  //       console.log('paused');
  //       this.stopTrackingTime();
  //       break;
  //     case YT.PlayerState.ENDED:
  //       console.log('onend');
  //       this.stopTrackingTime();
  //       break;
  //   }
  // }

  // startTrackingTime() {
  //   this.stopTrackingTime();
  //   this.intervalId = setInterval(() => {
  //     this.zone.run(() => {
  //       const currentTime = this.player.getCurrentTime();
  //       console.log('ontimeupdate', currentTime);
  //     });
  //   }, 1000); // fires every second
  // }

  // stopTrackingTime() {
  //   if (this.intervalId) {
  //     clearInterval(this.intervalId);
  //     this.intervalId = null;
  //   }
  // }

  ngOnDestroy() {
   // this.cleanup();
  }

  loadVideo() {
    debugger;
    this.youtubeEmbedUrl="";
    this.isyoutube=false;
    if (this.videofiletype=="VIDEO") {
       this.videoService.streamVideo(this.videoFilename).subscribe((data: ArrayBuffer)=> {
        debugger;
        const videoBlob = new Blob([data], { type: 'video/mp4' });
        const url = URL.createObjectURL(videoBlob);        
        this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        this.isLoading = false;
        debugger;
        // Start progress tracking after a short delay
        setTimeout(() => this.startProgressTracking(), 1000);
      },
      (error) => {
        console.error('Error loading video:', error);
        this.isLoading = false;
      }
      );
    }
    else {
        if (this.isYouTubeUrl(this.videoFilename)) {
           this.isyoutube=true;
           this.isLoading = false;

           if (!(window as any)['YT'] || !(window as any)['YT'].Player) {
              (window as any)['onYouTubeIframeAPIReady'] = () => this.createYoutubePlayer();
              const tag = document.createElement('script');
              tag.src = 'https://www.youtube.com/iframe_api';
              document.body.appendChild(tag);
           } else {
              this.createYoutubePlayer();
           }


          //  if (window['YT'] && window['YT'].Player) {
              
          //     this.createPlayer();
          //  } else {

          //     window['onYouTubeIframeAPIReady'] = () => this.createPlayer();
          //  }             
           /*this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
           this.getYouTubeEmbedUrl(this.videoFilename)
          );*/
       //   setTimeout(() => this.initYouTubePlayer(), 0);
        } else {
           this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(this.videoFilename);
           setTimeout(() => this.startProgressTracking(), 1000);
        }      
   

        this.isLoading = false;
        
        // Start progress tracking after a short delay
        

    }
  }

private createYoutubePlayer() {
    const videoId = this.extractYoutubeId(this.videoFilename);
    if (!videoId) return;

    this.ytPlayer = new YT.Player(this.playerContainer.nativeElement, {
      videoId,
      playerVars: { autoplay: 0, controls: 0 },
      events: {
        onReady: this.onYTPlayerReady.bind(this),
        onStateChange: (event: any) => this.onYoutubeStateChange(event),
      },
    });
debugger;


    // this.progressInterval = setInterval(() => {
    //   if (this.videoElement && this.videoElement.nativeElement) {
    //     const video = this.videoElement.nativeElement;
    //     this.currentTime =video.currentTime;
    //     this.duration = video.duration || 0;
    //     this.progress = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
    //     this.isPlaying = !video.paused;
    //   }
    // }, 1000);

    // // Update progress to backend every 30 seconds
    // this.updateInterval = setInterval(() => {
    //   if (this.contentId && this.duration > 0 && this.currentTime > 0) {
    //     this.updateProgressToServer();
    //   }
    // }, 1000);


  }

onYTPlayerReady(event: any) {
console.log('Player ready');
    // Start at 10s for example
  this.duration = this.ytPlayer.getDuration() || 0;
  this.progressService.getProgress(this.currentUser["user"]["id"], this.contentId).subscribe({
    next: (progress) => {
      if (progress && progress[0] != undefined) {
        if (progress[0].lastPosition > 0)
            this.YTseekTo(Math.round(progress[0].lastPosition));

      }
// Check playback position every second
    // setInterval(() => {
    //   if (this.player) {
    //     const currentTime = this.player.getCurrentTime();

    //     // Update allowed time only if video is playing normally
    //     if (this.player.getPlayerState() === YT.PlayerState.PLAYING) {
    //       if (currentTime > this.lastAllowedTime) {
    //         this.lastAllowedTime = currentTime;
    //       }
    //     }
    //   }
    // }, 1000);      
    },
    error: (err) => console.error('Error loading progress:', err)
  });


}

YTseekTo(seconds: number) {
    if (this.ytPlayer && this.ytPlayer.seekTo) {
      this.ytPlayer.seekTo(seconds, true);
    }
  }

private onYoutubeStateChange(event: any) {
  debugger;
// If user tries to seek ahead
    
    //  if (this.ytPlayer.getCurrentTime() > (this.currentTime + 1)) {
    //    this.ytPlayer.seekTo(this.currentTime, true);
    //    return;
    //  }  
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        console.log('YouTube: onplay');
        this.startTrackingTime();
        break;
      case YT.PlayerState.PAUSED:
        this.stopTrackingTime();
        break;
      case YT.PlayerState.ENDED:
        console.log('YouTube: onend');
        this.stopTrackingTime();
        break;
    }
  }

private startTrackingTime() {
    this.stopTrackingTime();
    this.intervalId = setInterval(() => {
      this.zone.run(() => {
        this.currentTime = this.ytPlayer.getCurrentTime();
        this.progress = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
        if (this.contentId && this.duration > 0 && this.currentTime > 0) {
           this.updateProgressToServer();
        }        
        console.log('YouTube: ontimeupdate', this.currentTime);
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


private extractVideoId(url: string): string {
    if (url.includes('youtube.com')) {
      return new URL(url).searchParams.get('v') || '';
    } else if (url.includes('youtu.be')) {
      return url.split('/').pop() || '';
    }
    return '';
  }

  startProgressTracking_youtube() {
// Load existing progress
debugger;
  }

 
  startProgressTracking() {
// Load existing progress
debugger;
  this.progressService.getProgress(this.currentUser["user"]["id"], this.contentId).subscribe({
    next: (progress) => {
      if (progress && progress[0] != undefined) {
        if (progress[0].lastPosition > 0)
           this.videoElement.nativeElement.currentTime = Math.round(progress[0].lastPosition);
      }
    },
    error: (err) => console.error('Error loading progress:', err)
  });


    this.progressInterval = setInterval(() => {
      if (this.videoElement && this.videoElement.nativeElement) {
        const video = this.videoElement.nativeElement;
        this.currentTime =video.currentTime;
        this.duration = video.duration || 0;
        this.progress = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
        this.isPlaying = !video.paused;
      }
    }, 1000);

    // Update progress to backend every 30 seconds
    this.updateInterval = setInterval(() => {
      if (this.contentId && this.duration > 0 && this.currentTime > 0) {
        this.updateProgressToServer();
      }
    }, 1000);
  }

  updateProgressToServer() {
debugger;
 const progressData: ProgressUpdateRequest = {
    userId: this.currentUser["user"]["id"],
    contentId: this.contentId,
    currentPosition: Math.round(this.currentTime),
    duration: Math.round(this.duration),
    timestamp: new Date().toISOString()
  };

  this.progressService.updateProgress(progressData).subscribe({
    next: () => console.log('Progress updated successfully'),
    error: (err) => console.error('Error updating progress:', err)
  });
      
  }

  onTimeUpdate() {
    this.currentTime = this.videoElement.nativeElement.currentTime;
    console.log("cur time",this.currentTime);
  }

  onLoadedMetadata() {
    this.duration = this.videoElement.nativeElement.duration;
    console.log("duration",this.duration);
  }

  togglePlay() {
    const video = this.videoElement.nativeElement;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  seekTo(event: MouseEvent):void {
    debugger;
    const progressBar = event.currentTarget as HTMLElement;

    const video = this.videoElement.nativeElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * video.duration;
    if (video.currentTime < newTime) {
       this.toastr.warning("you can't forward track...", 'Permission Denied!')
    }
    else {
      video.currentTime = newTime;
    }
    
  }

  setVolume(level: number) {
    this.volume = level;
    this.videoElement.nativeElement.volume = level;
  }

  toggleFullscreen() {
    const video = this.videoElement.nativeElement;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  }


  
  private cleanup() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
  private isYouTubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }
  

  private getYouTubeEmbedUrl(url: string): string {
    let videoId = '';

    if (url.includes('youtube.com')) {
      const params = new URL(url).searchParams;
      videoId = params.get('v') || '';
    } else if (url.includes('youtu.be')) {
      videoId = url.split('/').pop() || '';
    }

    return `https://www.youtube.com/embed/${videoId}`;
  }

  

}
