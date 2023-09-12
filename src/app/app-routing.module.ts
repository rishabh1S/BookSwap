import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { BookStoreComponent } from './components/book-store/book-store.component';
import { ListBookComponent } from './components/list-book/list-book.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'bookStore',
    component: BookStoreComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listBook',
    component: ListBookComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'chat/:uid',
    component: ChatComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
