import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";

@NgModule({
    imports: [
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatSidenavModule,
        MatToolbarModule
    ],
    exports: [
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatSidenavModule,
        MatToolbarModule
    ]
})
export class MaterialModule {}
