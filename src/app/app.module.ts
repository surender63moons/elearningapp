import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { ProgressTrackerComponent } from './components/progress-tracker/progress-tracker.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InstructorDashboardComponent } from './components/instructor-dashboard/instructor-dashboard.component';
import { CourseCreateComponent } from './components/course-create/course-create.component';

// Pipes
import { TimeFormatPipe } from './pipes/time-format.pipe';

// Services
import { VideoService } from './services/video.service';
import { CourseService } from './services/course.service';
import { ProgressService } from './services/progress.service';
import { AuthService } from './services/auth.service';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { InstructorGuard } from './guards/instructor.guard';
import { McqTestComponent } from './components/mcq-test/mcq-test.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from "ngx-toastr";
import { VideoPlayerDirective } from './directives/video-player.directive';
import { VideoPlayerAllComponent } from './components/video-player-all/video-player-all.component';
import { HomeComponent } from './components/home/home.component';
@NgModule({
  declarations: [
    AppComponent,
    VideoPlayerComponent,
    CourseListComponent,
    CourseDetailComponent,
    ProgressTrackerComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    InstructorDashboardComponent,
    CourseCreateComponent,
    TimeFormatPipe,
    McqTestComponent,
    VideoPlayerDirective,
    VideoPlayerAllComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    AppRoutingModule  // Add this instead of RouterModule.forRoot()
  ],
  providers: [
    VideoService,
    CourseService,
    ProgressService,
    AuthService,
    AuthGuard,
    InstructorGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }