import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../interfaces/LoginResponse';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    console.log(this.username);
    console.log(this.password);
    this.authService.login(this.username, this.password).subscribe({
      next: (value: LoginResponse) => {
        sessionStorage.setItem('user', JSON.stringify(value));
        sessionStorage.setItem('token', value.token);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login failed', error);
      },
      complete: () => {
        console.log('Login request completed');
      },
    });
  }
}
