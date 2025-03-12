import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { UniPageComponent } from './pages/uni-page/uni-page.component';
import { FacultyPageComponent } from './pages/faculty-page/faculty-page.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },

    { path: "select-uni", component: UniPageComponent },
    { path: ":uni/faculties", component: FacultyPageComponent },
];