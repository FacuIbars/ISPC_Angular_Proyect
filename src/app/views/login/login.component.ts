import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faUser, faLock,} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  faUser = faUser; 
  faLock = faLock;

 
  constructor(private router: Router) {}

  onSubmit() {
    // Aquí puedes agregar la lógica de autenticación.
    // Por ejemplo, puedes llamar a un servicio para verificar las credenciales.
    if (this.username === 'usuario' && this.password === 'contraseña') {
      // Si las credenciales son válidas, navega a la página de inicio.
      this.router.navigate(['/inicio']);
    } else {
      // Si las credenciales son incorrectas, muestra un mensaje de error.
      alert('Credenciales incorrectas');
    }
  }
}
