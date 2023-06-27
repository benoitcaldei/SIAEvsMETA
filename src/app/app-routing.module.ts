import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { MusicListenComponent } from './component/music-listen/music-listen/music-listen.component';
import { AdvertisementComponent } from './component/advertisement/advertisement.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'music-listen', component: MusicListenComponent, canActivate: []},
  { path: 'advertisement-page', component: AdvertisementComponent, canActivate:[] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
