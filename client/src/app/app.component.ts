import { Component, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    @ViewChild("sidenav") sideNav: MatSidenav;

    static parameters = [Router];
    constructor(private router: Router) {
    }

    openSidenav() {
        this.sideNav.open();
    }
}
