import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { StartComponent } from './start.component';

export const ROUTES: Routes = [
    { path: 'start', component: StartComponent },
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(ROUTES),
    ],
    declarations: [
        StartComponent,
    ],
    providers: [
    ],
    exports: [
        StartComponent,
    ],
})
export class StartModule {}
