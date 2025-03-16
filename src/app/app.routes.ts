import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { UniPageComponent } from './pages/uni-page/uni-page.component';
import { SelectionPageComponent } from './pages/selection-page/selection-page.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },

    { path: "select-uni", component: UniPageComponent },
    { path: ":uni/select-faculty", component: SelectionPageComponent },
    { path: ":uni/:faculty/select-year", component: SelectionPageComponent },
    { path: ":uni/:faculty/:year/select-season", component: SelectionPageComponent },
    { path: ":uni/:faculty/:year/:season/select-subject", component: SelectionPageComponent }
];