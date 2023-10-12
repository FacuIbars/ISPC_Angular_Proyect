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
            const token = response && response.authToken;
            if (token) {
              this.router.navigate(['']);
              localStorage.setItem('token', token);        
            } else {
              // Manejar el caso en el que el token no está presente en la respuesta
            }
          },
          error: (e: HttpErrorResponse) => {        
            if (e.status == 401) {
              this.modalService.mensaje("Usuario y/o contraseña incorrectos!! Inténtalo Nuevamente o Regresa haciendo click en Cancelar.", 4)
            }
            // Manejar otros errores si es necesario
          }
        });
      }
    }
  }
}
