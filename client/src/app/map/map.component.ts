import { Component, ViewChild, ElementRef } from "@angular/core";
import { BoardService, Property } from "../../components/services/board.service";

@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.scss"]
})
export class MapComponent {
    private MAX_ZOOM = 4;
    private MIN_ZOOM = 0.52;
    private zoomLevel = 0.52;
    private properties : Property[] = [];

    static parameters = [BoardService];
    constructor(private boardService: BoardService) {
        this.boardService.getProperties().subscribe(p => this.properties = p);
    }

    private zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel * 2, this.MAX_ZOOM)
    }

    private zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel / 2, this.MIN_ZOOM)
    }
}
