import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { SelectionPageComponent } from './pages/selection-page/selection-page.component';

import { SelectSubjectPageComponent } from './pages/select-subject-page/select-subject-page.component';
import { SelectAssignmentComponent } from './pages/select-assignment/select-assignment.component';
import { AssignmentPageComponent } from './pages/assignment-page/assignment-page.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },

    //Pages to get the all of the main info:
    { path: "selection-page", component: SelectionPageComponent },

    //Page to select the subject for the chosen data:
    { path: ":uni/:faculty/:year/:season/select-subject", component: SelectSubjectPageComponent },
    { path: ":uni/:faculty/:year/:season/select-assignment/:subject", component: SelectAssignmentComponent },
    { path: ":uni/:subject/:assignment", component: AssignmentPageComponent },

];