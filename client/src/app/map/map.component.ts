import { Component, ViewChild, ElementRef } from "@angular/core";

@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.scss"]
})
export class MapComponent {
    private properties = [
        {
            name: "Bag end",
            color: "purple",
            price: 60,
            rent: 2,
            position: 1,
            geo: { x: 0.19, y: 0.26 }
        },
        {
            name: "Bree",
            color: "purple",
            price: 60,
            rent: 4,
            position: 3,
            geo: { x: 0.23, y: 0.265 }
        },
        {
            name: "Weathertop",
            color: "white",
            price: 100,
            rent: 6,
            position: 6,
            geo: { x: 0.273, y: 0.265 }
        },
        {
            name: "Last Bridge of Mitheinel",
            color: "white",
            price: 100,
            rent: 6,
            position: 8,
            geo: { x: 0.34, y: 0.25 }
        },
        {
            name: "Ford of Bruinen",
            color: "white",
            price: 120,
            rent: 8,
            position: 9,
            geo: { x: 0.384, y: 0.24 }
        },
        {
            name: "Rivendell",
            color: "pink",
            price: 140,
            rent: 10,
            position: 11,
            geo: { x: 0.42, y: 0.24 }
        },
        {
            name: "Redhorn Pass",
            color: "pink",
            price: 140,
            rent: 10,
            position: 13,
            geo: { x: 0.42, y: 0.272 }
        },
        {
            name: "Gates of Moria",
            color: "pink",
            price: 160,
            rent: 12,
            position: 14,
            geo: { x: 0.4, y: 0.29 }
        },
        {
            name: "Celebdil",
            color: "orange",
            price: 180,
            rent: 14,
            position: 16,
            geo: { x: 0.455, y: 0.28 }
        },
        {
            name: "Mirrormere",
            color: "orange",
            price: 180,
            rent: 14,
            position: 18,
            geo: { x: 0.485, y: 0.29 }
        },
        {
            name: "Lothlórien",
            color: "orange",
            price: 200,
            rent: 16,
            position: 19,
            geo: { x: 0.541, y: 0.295 }
        },
        {
            name: "Fangorn",
            color: "red",
            price: 220,
            rent: 18,
            position: 21,
            geo: { x: 0.495, y: 0.317 }
        },
        {
            name: "Nen Hithoel",
            color: "red",
            price: 220,
            rent: 18,
            position: 23,
            geo: { x: 0.603, y: 0.335 }
        },
        {
            name: "Gap of Rohan",
            color: "red",
            price: 240,
            rent: 20,
            position: 24,
            geo: { x: 0.42, y: 0.345 }
        },
        {
            name: "Edoras",
            color: "yellow",
            price: 260,
            rent: 22,
            position: 26,
            geo: { x: 0.48, y: 0.363 }
        },
        {
            name: "Emyn Mull",
            color: "yellow",
            price: 260,
            rent: 22,
            position: 27,
            geo: { x: 0.609, y: 0.363 }
        },
        {
            name: "Dead Marshes",
            color: "yellow",
            price: 280,
            rent: 24,
            position: 29,
            geo: { x: 0.637, y: 0.35 }
        },
        {
            name: "Morannon",
            color: "green",
            price: 300,
            rent: 26,
            position: 31,
            geo: { x: 0.667, y: 0.358 }
        },
        {
            name: "Minas Tirith",
            color: "green",
            price: 300,
            rent: 26,
            position: 32,
            geo: { x: 0.65, y: 0.393 }
        },
        {
            name: "Minas Morgul",
            color: "green",
            price: 320,
            rent: 28,
            position: 34,
            geo: { x: 0.688, y: 0.393 }
        },
        {
            name: "Mount Doom",
            color: "blue",
            price: 350,
            rent: 35,
            position: 37,
            geo: { x: 0.722, y: 0.395 }
        },
        {
            name: "Barad Dûr",
            color: "blue",
            price: 400,
            rent: 50,
            position: 39,
            geo: { x: 0.752, y: 0.386 }
        }
    ];
    private zoomLevel = 0.5;
    @ViewChild("map")
    sideNav: ElementRef;
    constructor() {}

    private zoomIn() {
        if (this.zoomLevel < 2) this.zoomLevel *= 2;
    }

    private zoomOut() {
        if (this.zoomLevel > 0.25) this.zoomLevel /= 2;
    }
}
