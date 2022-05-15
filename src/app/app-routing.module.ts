import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './home/home.component';
import { StudentDashboardLabsComponent } from './student-dashboard-labs/student-dashboard-labs.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent
  }, {
    path: 'student-dashboard',
    component: StudentDashboardComponent
  }, {
    path: 'student-dashboard-allLabs',
    component: StudentDashboardLabsComponent
  }, {
    path: 'teacher-dashboard',
    component: TeacherDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
