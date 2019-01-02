import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StartComponent } from "./start/start.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AssetsComponent } from "./assets/assets.component";
import { LeaveComponent } from "./leave/leave.component";
import { StatsComponent } from "./stats/stats.component";
import { MapComponent } from "./map/map.component";
import { TransferComponent } from "./transfer/transfer.component";

const routes: Routes = [
    {
        path: "",
        redirectTo: "/start",
        pathMatch: "full"
    },
    { path: "start", component: StartComponent },
    { path: "dashboard", component: DashboardComponent },
    { path: "map", component: MapComponent },
    { path: "leave", component: LeaveComponent },
    { path: "stats", component: StatsComponent },
    { path: "assets", component: AssetsComponent },
    { path: "transfers", component: TransferComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
