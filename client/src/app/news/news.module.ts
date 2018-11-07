import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NewsComponent } from './news.component';

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [
        NewsComponent,
    ],
    providers: [
    ],
    exports: [
        NewsComponent,
    ],
})
export class NewsModule {}
