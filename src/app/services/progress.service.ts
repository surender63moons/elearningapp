import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface ProgressData {
  id: number;
  studentId: number;
  contentId: number;
  progressPercentage: number;
  completed: boolean;
  lastPosition: number;
  timeSpent: number;
  lastAccessed: string;
  contentTitle?: string;
  courseTitle?: string;
}

export interface CourseProgress {
  courseId: number;
  courseTitle: string;
  totalContents: number;
  completedContents: number;
  overallProgress: number;
  timeSpent: number;
  lastAccessed: string;
}

export interface ProgressUpdateRequest {
  userId: number;
  contentId: number;
  currentPosition: number;
  duration: number;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private apiUrl = 'http://localhost:8025/api/progress';
  private progressSubject = new BehaviorSubject<ProgressData[]>([]);
  public progress$ = this.progressSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Update progress for specific content
  updateProgress(request: ProgressUpdateRequest): Observable<any> {
//@RequestParam("sId"),@RequestParam("cId"),@RequestParam("currentPosition"),@RequestParam("duration")
    return this.http.post(`${this.apiUrl}/update?sId=${request.userId}&cId=${request.contentId}&currentPosition=${request.currentPosition}&duration=${request.duration}`,request)
      .pipe(
        tap(updatedProgress => {
          debugger;
          // Update local state
          const currentProgress = this.progressSubject.value;
       /*   const index = currentProgress.findIndex(p => p.studentId=== updatedProgress.studentId && p.contentId === updatedProgress.contentId);
          
          if (index >= 0) {
            currentProgress[index] = updatedProgress;
          } else {*/
            currentProgress.push(updatedProgress);
          /*}*/
          
          this.progressSubject.next([...currentProgress]);
        })
      );
  }

  // Get progress for specific content
  getProgress(studentId: number,contentId: number): Observable<ProgressData> {
    return this.http.get<ProgressData>(`${this.apiUrl}?sId=${studentId}&cId=${contentId}`);
  }

  // Get all progress for current user
  getUserProgress(): Observable<ProgressData[]> {
    return this.http.get<ProgressData[]>(`${this.apiUrl}/user`).pipe(
      tap(progress => this.progressSubject.next(progress))
    );
  }

  // Get progress for a specific course
  getCourseProgress(courseId: number): Observable<CourseProgress> {
    return this.http.get<CourseProgress>(`${this.apiUrl}/course/${courseId}`);
  }

  // Get overall progress summary
  getOverallProgress(): Observable<CourseProgress[]> {
    return this.http.get<CourseProgress[]>(`${this.apiUrl}/overview`);
  }

  // Mark content as completed
  markAsCompleted(contentId: number): Observable<ProgressData> {
    return this.http.post<ProgressData>(`${this.apiUrl}/complete`, { contentId });
  }

  // Reset progress for content
  resetProgress(contentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reset/${contentId}`).pipe(
      tap(() => {
        const currentProgress = this.progressSubject.value;
        const updatedProgress = currentProgress.filter(p => p.contentId !== contentId);
        this.progressSubject.next(updatedProgress);
      })
    );
  }

  // Get recently accessed content
  getRecentProgress(limit: number = 5): Observable<ProgressData[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<ProgressData[]>(`${this.apiUrl}/recent`, { params });
  }

  // Get progress statistics
  getProgressStats(): Observable<{
    totalCourses: number;
    completedCourses: number;
    totalTimeSpent: number;
    averageProgress: number;
    weeklyProgress: any[];
  }> {
    return this.http.get<{
      totalCourses: number;
      completedCourses: number;
      totalTimeSpent: number;
      averageProgress: number;
      weeklyProgress: any[];
    }>(`${this.apiUrl}/stats`);
  }

  // Sync local progress with server (for offline capability)
  syncProgress(progressUpdates: ProgressUpdateRequest[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/sync`, progressUpdates);
  }

  // Get progress by module
  getModuleProgress(moduleId: number): Observable<{
    moduleId: number;
    moduleTitle: string;
    totalContents: number;
    completedContents: number;
    moduleProgress: number;
    contents: ProgressData[];
  }> {
    return this.http.get<{
      moduleId: number;
      moduleTitle: string;
      totalContents: number;
      completedContents: number;
      moduleProgress: number;
      contents: ProgressData[];
    }>(`${this.apiUrl}/module/${moduleId}`);
  }

  // Check if content is completed
  isContentCompleted(contentId: number): boolean {
    const progress = this.progressSubject.value.find(p => p.contentId === contentId);
    return progress ? progress.completed : false;
  }

  // Get progress percentage for content
  getContentProgress(contentId: number): number {
    const progress = this.progressSubject.value.find(p => p.contentId === contentId);
    return progress ? progress.progressPercentage : 0;
  }

  // Get last position for video content
  getLastPosition(contentId: number): number {
    const progress = this.progressSubject.value.find(p => p.contentId === contentId);
    return progress ? progress.lastPosition : 0;
  }
}