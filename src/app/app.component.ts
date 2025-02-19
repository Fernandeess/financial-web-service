import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SidebarAuthComponent } from './components/sidebar-auth/sidebar-auth.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SidebarModule,
    ButtonModule,
    RippleModule,
    SidebarAuthComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  closeCallback(event: Event): void {
    this.sidebarRef.close(event);
  }

  sidebarVisible: boolean = false;
}
