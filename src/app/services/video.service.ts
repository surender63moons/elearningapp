import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiUrl = 'http://localhost:8025/api';

  constructor(private http: HttpClient) { }

  getVideoStreamUrl(filename: string): string {
    return `${this.apiUrl}/video/stream/${filename}`;
  }

  streamVideo(filename: string, range?: string): Observable<any> {
     let headers = new HttpHeaders();
     if (range) {
       headers = headers.set('Range', range);
     }

  
    return this.http.get(`${this.apiUrl}/video/stream/${filename}`, {
      responseType: 'arraybuffer',
      headers: headers,
      reportProgress: true,
    });
  }

  updateProgress(contentId: number, currentTime: number, duration: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/progress/update`, {
      contentId: contentId,
      currentPosition: Math.round(currentTime),
      duration: Math.round(duration),
      timestamp: new Date().toISOString()
    });
  }

  getProgress(contentId: number): Observable<number> {
    return this.http.get<{progress: number}>(`${this.apiUrl}/progress/${contentId}`)
      .pipe(map(response => response.progress));
  }
}
