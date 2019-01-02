import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from '@angular/material/table';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    imports: [
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTableModule,
        MatBottomSheetModule,
        MatCardModule,
    ],
    exports: [
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTableModule,
        MatBottomSheetModule,
        MatCardModule,
    ]
})
export class MaterialModule {}
