import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faUser, faLock,} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/service/auth.service';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  username: string = '';
  password: string = '';
  faUser = faUser; 
  faLock = faLock;
  

 
  constructor(
    private auth: AuthService,
    private router: Router, 
    private fb:FormBuilder,
    private modalService: ModalService,) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
 
  onSubmit() {
    if (this.loginForm && this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      if (username && password) {
        this.auth.login(username, password).subscribe({
          next: (response) => {
            const token = response && response.token;
            if (token) {
              localStorage.setItem('token', token);
              this.router.navigate(['']); // Redirige a la página principal o a la página deseada
            } else {
              // Maneja el caso en el que el token no está presente en la respuesta
            }
          },
          error: (e: HttpErrorResponse) => {
            if (e.status === 401) {
              // Maneja el caso de credenciales incorrectas
              console.error('Credenciales incorrectas');
            } else {
              // Maneja otros errores si es necesario
              console.error('Error en la solicitud:', e);
            }
          }
        });
      }
    }
  }
}
