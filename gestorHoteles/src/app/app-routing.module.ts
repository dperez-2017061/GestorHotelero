import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateHotelComponent } from './components/create-hotel/create-hotel.component';
import { EventsComponent } from './components/events/events.component';
import { FinalizedReservationsComponent } from './components/finalized-reservations/finalized-reservations.component';
import { GraphMostPopularComponent } from './components/graph-most-popular/graph-most-popular.component';
import { GuestsComponent } from './components/guests/guests.component';
import { HomeComponent } from './components/home/home.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ReservationsAdminHotelComponent } from './components/reservations-admin-hotel/reservations-admin-hotel.component';
import { ReservationsByHotelComponent } from './components/reservations-by-hotel/reservations-by-hotel.component';
import { RoomsAdminComponent } from './components/rooms-admin/rooms-admin.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { UpcomingReservationsComponent } from './components/upcoming-reservations/upcoming-reservations.component';
import { UsersComponent } from './components/users/users.component';
import { HotelsComponent } from './components/hotels/hotels.component';
import { ViewHotelsComponent } from './components/view-hotels/view-hotels.component';
import { ActiveEventsComponent } from './components/active-events/active-events.component';
import { FinalizedEventsComponent } from './components/finalized-events/finalized-events.component';
import { AvailableRoomsComponent } from './components/available-rooms/available-rooms.component';
import { HotelComponent } from './components/hotel/hotel.component';
import { RoomComponent } from './components/room/room.component';
import { EventComponent } from './components/event/event.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { UserComponent } from './components/user/user.component';
import { UserGuard } from './guards/user.guard';
import { AdminGuard } from './guards/admin.guard';
import { ClientGuard } from './guards/client.guard';
import { AdminHotelGuard } from './guards/admin-hotel.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'hotel', component: HotelComponent, children:[
    {path: 'newhotel', canActivate:[AdminGuard], component: CreateHotelComponent},
    {path: 'hotelReservations', canActivate:[AdminHotelGuard], component: ReservationsAdminHotelComponent},
    {path: 'mostPopular', canActivate:[AdminGuard], component: GraphMostPopularComponent},
    {path: 'adminHotels', canActivate:[AdminGuard], component: HotelsComponent},
    {path: 'reservationsByHotel', canActivate:[AdminGuard], component: ReservationsByHotelComponent},
  ]},
  {path: 'room', component:RoomComponent, children:[
    {path: 'rooms/:idH', canActivate:[UserGuard], component: RoomsComponent},
    {path: 'roomsAdmin', canActivate:[AdminGuard], component: RoomsAdminComponent},
    {path: 'availableRooms', canActivate:[AdminHotelGuard], component:AvailableRoomsComponent},
  ]},
  {path: 'event', component:EventComponent, children:[
    {path: 'events/:idH', canActivate:[UserGuard], component: EventsComponent},
    {path: 'activeEvents', canActivate:[ClientGuard], component: ActiveEventsComponent},
    {path: 'finalizedEvents', canActivate:[ClientGuard], component: FinalizedEventsComponent},
  ]},
  {path: 'reservation', component: ReservationComponent, children:[
    {path: 'upcomingReservations', canActivate:[ClientGuard], component: UpcomingReservationsComponent},
    {path: 'finalizedReservations', canActivate:[ClientGuard], component: FinalizedReservationsComponent},
  ]},
  {path: 'user', component: UserComponent, children:[
    {path: 'users', canActivate:[AdminGuard], component: UsersComponent},
    {path: 'guests', canActivate:[AdminHotelGuard], component: GuestsComponent},
    {path: 'profile', canActivate:[UserGuard], component: ProfileComponent},
    {path: 'invoice', canActivate:[ClientGuard], component: InvoiceComponent},
  ]},
  {path: 'hotels', component: ViewHotelsComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
