import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8025/api/auth';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(map(response => {

        //if (response && response.token) {
          localStorage.setItem('currentUser', JSON.stringify(response));
          //localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response);
        //}
        return response;
      }));
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('currentUser');
   // localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    const user = this.currentUserValue;
   // const token = localStorage.getItem('token');
    return !!(user );
  }

  isInstructor(): boolean {
    const user = this.currentUserValue;
    return user && user.role === 'INSTRUCTOR';
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user && user.role === 'ADMIN';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}