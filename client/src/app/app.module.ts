import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { BoardModule } from './board/board.module';
import { PanelModule } from './panel/panel.module';
import { StartModule } from './start/start.module';
import { NewsModule } from './news/news.module';
import { ServicesModule } from '../components/services/services.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    BoardModule,
    PanelModule,
    StartModule,
    NewsModule,
    ServicesModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
