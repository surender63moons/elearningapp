import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProgressService, CourseProgress, ProgressData } from '../../services/progress.service';
import { CourseService } from '../../services/course.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress-tracker',
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.css']
})
export class ProgressTrackerComponent implements OnInit, OnDestroy {
  courseProgress: CourseProgress[] = [];
  recentProgress: ProgressData[] = [];
  progressStats: any = null;
  isLoading = true;
  selectedCourseId: number | null = null;
  detailedProgress: any = null;
  
  private subscriptions: Subscription = new Subscription();

  constructor(
    private progressService: ProgressService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.loadProgressData();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadProgressData() {
    this.isLoading = true;

    // Load overall progress
    this.subscriptions.add(
      this.progressService.getOverallProgress().subscribe({
        next: (progress) => {
          this.courseProgress = progress;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading progress:', error);
          this.isLoading = false;
        }
      })
    );

    // Load recent progress
    this.subscriptions.add(
      this.progressService.getRecentProgress(5).subscribe({
        next: (recent) => {
          this.recentProgress = recent;
        },
        error: (error) => {
          console.error('Error loading recent progress:', error);
        }
      })
    );

    // Load progress statistics
    this.subscriptions.add(
      this.progressService.getProgressStats().subscribe({
        next: (stats) => {
          this.progressStats = stats;
        },
        error: (error) => {
          console.error('Error loading progress stats:', error);
        }
      })
    );
  }

  viewCourseDetails(courseId: number) {
    this.selectedCourseId = courseId;
    this.subscriptions.add(
      this.progressService.getCourseProgress(courseId).subscribe({
        next: (details) => {
          this.detailedProgress = details;
        },
        error: (error) => {
          console.error('Error loading course details:', error);
        }
      })
    );
  }

  backToOverview() {
    this.selectedCourseId = null;
    this.detailedProgress = null;
  }

  getProgressColor(progress: number): string {
    if (progress >= 90) return 'success';
    if (progress >= 70) return 'info';
    if (progress >= 50) return 'warning';
    return 'danger';
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  calculateTotalProgress(): number {
    if (this.courseProgress.length === 0) return 0;
    const total = this.courseProgress.reduce((sum, course) => sum + course.overallProgress, 0);
    return Math.round(total / this.courseProgress.length);
  }
}