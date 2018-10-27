import { NgModule } from '@angular/core';
import { OpponentComponent } from './opponent.component';
import { OpponentService } from '../../components/services/opponent.service';

@NgModule({
    imports: [
    ],
    declarations: [
        OpponentComponent,
    ],
    providers: [
        OpponentService,
    ],
    exports: [
        OpponentComponent,
    ],
})
export class OpponentModule {}
