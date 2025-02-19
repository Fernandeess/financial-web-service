import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar-auth',
  standalone: true,
  imports: [
    SidebarModule,
    ButtonModule,
    RippleModule,
    AvatarModule,
    StyleClassModule,
    TreeModule,
  ],
  templateUrl: './sidebar-auth.component.html',
  styleUrl: './sidebar-auth.component.scss',
})
export class SidebarAuthComponent implements OnInit {
  visible: boolean = false;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  items: TreeNode[] | undefined;

  closeCallback(event: Event): void {
    this.sidebarRef.close(event);
  }
  toggleSidebar() {
    this.visible = !this.visible;
  }

  sidebarVisible: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // this.items = [
    //   {
    //     label: 'Documents',
    //     items: [
    //       {
    //         label: 'New',
    //         icon: 'pi pi-plus',
    //       },
    //       {
    //         label: 'Search',
    //         icon: 'pi pi-search',
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Profile',
    //     items: [
    //       {
    //         label: 'Settings',
    //         icon: 'pi pi-cog',
    //       },
    //       {
    //         label: 'Logout',
    //         icon: 'pi pi-sign-out',
    //       },
    //     ],
    //   },
    // ];
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
