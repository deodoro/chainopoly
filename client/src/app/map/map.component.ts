import { Component, ViewChild, ElementRef } from "@angular/core";
import { BoardService, Property } from "../../components/services/board.service";

@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.scss"]
})
export class MapComponent {
    private zoomLevel = 0.5;
    private properties : Property[] = [];

    static parameters = [BoardService];
    constructor(private boardService: BoardService) {
        this.boardService.getProperties().subscribe(p => this.properties = p);
    }

    private zoomIn() {
        if (this.zoomLevel < 2) this.zoomLevel *= 2;
    }

    private zoomOut() {
        if (this.zoomLevel > 0.25) this.zoomLevel /= 2;
    }
}
