import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  private zoomLevel = 1;
  @ViewChild("map") sideNav: ElementRef;
  constructor() { }

  private zoomIn() {
    if (this.zoomLevel < 2)
        this.zoomLevel *= 2;
  }

  private zoomOut() {
    if (this.zoomLevel > 0.25)
        this.zoomLevel /= 2;
  }

}
