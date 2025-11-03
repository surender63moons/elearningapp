import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ProgressService } from '../../services/progress.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  enrolledCourses: Course[] = [];
  progressData: any[] = [];
  isLoading = true;

  constructor(
    private courseService: CourseService,
    private progressService: ProgressService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.courseService.getStudentCourses().subscribe({
      next: (courses) => {
        this.enrolledCourses = courses;
        this.loadProgressData();
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.isLoading = false;
      }
    });
  }

  loadProgressData() {
    this.progressService.getOverallProgress().subscribe({
      next: (progress) => {
        this.progressData = progress;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading progress:', error);
        this.isLoading = false;
      }
    });
  }

  getOverallProgress(): number {
    if (this.progressData.length === 0) return 0;
    const total = this.progressData.reduce((sum, item) => sum + item.progress, 0);
    return Math.round(total / this.progressData.length);
  }
}