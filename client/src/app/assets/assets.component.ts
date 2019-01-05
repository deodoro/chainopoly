import { Component } from '@angular/core';
import { GameService } from "../../components/services/game.service";
import { Property } from "../../components/services/board.service";
import { PropertyComponent } from '../property/property.component';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import _ from 'lodash';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent {

    public balance = 0;
    public properties: Property[] = [];
    public data;
    static parameters = [GameService, MatBottomSheet];

    constructor(
        private gameService: GameService,
        private bottomSheet: MatBottomSheet
    ) {
        this.gameService.getProperties().subscribe(p => {
            this.properties = p;
        });
    }

    showCard(p) {
        const bottomSheetRef = this.bottomSheet.open(PropertyComponent, {
          ariaLabel: 'Property details',
          data: { 'property': p }
        });
    }
}
