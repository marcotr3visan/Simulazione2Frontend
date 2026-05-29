import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { User } from '../../entities/user.entity';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-user',
  standalone: false,
  templateUrl: './nav-user.component.html',
  styleUrl: './nav-user.component.css'
})
export class NavUserComponent {
  protected authSrv = inject(AuthService);
  @Input()
  user!: User;

  @Output()
  logout = new EventEmitter<void>();

  onLogout() {
    this.authSrv.logout();
  }
}
