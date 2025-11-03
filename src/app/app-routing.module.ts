import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { CourseListComponent } from './components/course-list/course-list.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { ProgressTrackerComponent } from './components/progress-tracker/progress-tracker.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { VideoPlayerAllComponent } from './components/video-player-all/video-player-all.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InstructorDashboardComponent } from './components/instructor-dashboard/instructor-dashboard.component';
import { CourseCreateComponent } from './components/course-create/course-create.component';
import { HomeComponent } from './components/home/home.component';
// Guards
import { AuthGuard } from './guards/auth.guard';
import { InstructorGuard } from './guards/instructor.guard';

const routes: Routes = [
  // Public routes
  { path: 'courses', component: CourseListComponent },
  { path: 'course/:id', component: CourseDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },  
  { path: 'register', component: RegisterComponent },
  
  // Protected routes - Student
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'progress', 
    component: ProgressTrackerComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'my-courses', 
    component: CourseListComponent, 
    canActivate: [AuthGuard],
    data: { myCourses: true } 
  },
  
  // Protected routes - Instructor
  { 
    path: 'instructor/dashboard', 
    component: InstructorDashboardComponent, 
    canActivate: [AuthGuard, InstructorGuard] 
  },
  { 
    path: 'instructor/courses', 
    component: CourseListComponent, 
    canActivate: [AuthGuard, InstructorGuard],
    data: { instructorCourses: true } 
  },
  { 
    path: 'instructor/course/create', 
    component: CourseCreateComponent, 
    canActivate: [AuthGuard, InstructorGuard] 
  },
  { 
    path: 'instructor/course/edit/:id', 
    component: CourseCreateComponent, 
    canActivate: [AuthGuard, InstructorGuard] 
  },
  
  // Video player route
  { 
    path: 'playvideo', 
    component: VideoPlayerComponent, 
    canActivate: [AuthGuard] 
  },
  
  // Wildcard route
 { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    useHash: true,
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }