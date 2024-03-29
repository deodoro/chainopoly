import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ServicesModule } from '../components/services/services.module';
import { MaterialModule } from '../components/material.module';

import { StartComponent } from './start/start.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssetsComponent } from './assets/assets.component';
import { MapComponent } from './map/map.component';
import { MarkerComponent } from './map/marker.component';
import { StatsComponent } from './stats/stats.component';
import { LeaveComponent } from './leave/leave.component';
import { TransferComponent } from './transfer/transfer.component';
import { PropertyComponent } from './property/property.component';
import { UserheaderComponent } from './userheader/userheader.component';
import { TestpanelComponent } from './testpanel/testpanel.component';
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    AssetsComponent,
    MapComponent,
    StatsComponent,
    StartComponent,
    DashboardComponent,
    LeaveComponent,
    TransferComponent,
    MarkerComponent,
    PropertyComponent,
    UserheaderComponent,
    TestpanelComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ServicesModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
  ],
  entryComponents: [PropertyComponent, ErrorComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
