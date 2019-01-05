import { Component, ViewChild, ElementRef } from "@angular/core";
import { BoardService, Property } from "../../components/services/board.service";

@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.scss"]
})
export class MapComponent {
    public MAX_ZOOM = 4;
    public MIN_ZOOM = 0.52;
    public zoomLevel = 0.52;
    public properties : Property[] = [];

    static parameters = [BoardService];
    constructor(private boardService: BoardService) {
        this.boardService.getProperties().subscribe(p => this.properties = p);
    }

    public zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel * 2, this.MAX_ZOOM)
    }

    public zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel / 2, this.MIN_ZOOM)
    }
}
