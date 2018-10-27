import { NgModule } from '@angular/core';
import { PlayerComponent } from './player.component';
import { PlayerService } from '../../components/services/player.service';

@NgModule({
    imports: [
    ],
    declarations: [
        PlayerComponent,
    ],
    providers: [
        PlayerService,
    ],
    exports: [
        PlayerComponent,
    ],
})
export class PlayerModule {}
