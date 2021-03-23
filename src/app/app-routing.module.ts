import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeModule } from './home/home.module';
import { VersionHistoryComponent } from './home/version-history/version-history.component';

const routes: Routes = [
  {
    path: '',
    component: VersionHistoryComponent
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HomeModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
