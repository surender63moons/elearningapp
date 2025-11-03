import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMenuCollapsed = true;
  currentUser: any;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    debugger;
    this.authService.currentUser.subscribe(user => {
      debugger;
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isInstructor(): boolean {
    return this.authService.isInstructor();
  }
}