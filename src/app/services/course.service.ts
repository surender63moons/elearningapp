import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, CourseModule } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8025/api/courses';

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  getModuleByCourseId(id: number): Observable<any> {
    debugger;
    return this.http.get<any>(`${this.apiUrl}/getModulebyCourseId/${id}`);
  }

  getCourseContent(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/content`);
  }

  enrollInCourse(courseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/enroll`, {});
  }

  getStudentCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/student/my-courses`);
  }
}
