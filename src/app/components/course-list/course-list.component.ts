import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course, CourseModule } from '../../models/course.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  Courses: Course[] = [];
  Coursemodules: any[]  = [];
  progressData: any[] = [];
  contentlist: any[] = [];
  isLoading = true;
  courseid:any;
  contentid:any;
  moduleid:any;
  constructor( private courseService: CourseService, private router: Router) { }

  ngOnInit() {
     this.loadCourseData();
  }
  
 loadCourseData() {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.Courses = courses;
        console.log("courses:",this.Courses);

      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.isLoading = false;
      }
    });
  }

 showmodule(courseid) {
   this.courseid=courseid;
    this.courseService.getModuleByCourseId(courseid).subscribe({
      next: (coursemodule) => {
        this.Coursemodules = coursemodule;
        console.log("modules:",this.Coursemodules);

      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.isLoading = false;
      }
    });
  }

showcontentlist(obj) {
  debugger;
 console.log("selected module:",obj);
 this.contentlist=obj.contents;
 this.moduleid=obj.id; 


}  

showplayer(obj) {
  debugger;
   this.contentid=obj.id; 
 this.router.navigate(['/playvideo'], {queryParams:obj});
}
}
