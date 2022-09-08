import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RoomsComponent } from './components/rooms/rooms.component';
import { UpcomingReservationsComponent } from './components/upcoming-reservations/upcoming-reservations.component';
import { FinalizedReservationsComponent } from './components/finalized-reservations/finalized-reservations.component';
import { ReservationsAdminHotelComponent } from './components/reservations-admin-hotel/reservations-admin-hotel.component';
import { CreateHotelComponent } from './components/create-hotel/create-hotel.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RoomsAdminComponent } from './components/rooms-admin/rooms-admin.component';
import { GraphMostPopularComponent } from './components/graph-most-popular/graph-most-popular.component';
import { NgChartsModule } from 'ng2-charts';
import { ReservationsByHotelComponent } from './components/reservations-by-hotel/reservations-by-hotel.component';
import { UsersComponent } from './components/users/users.component';
import { GuestsComponent } from './components/guests/guests.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EventsComponent } from './components/events/events.component';
import { ActiveEventsComponent } from './components/active-events/active-events.component';
import { FinalizedEventsComponent } from './components/finalized-events/finalized-events.component';
import { SearchPipe } from './pipes/search.pipe';
import { ViewHotelsComponent } from './components/view-hotels/view-hotels.component';
import { HotelsComponent } from './components/hotels/hotels.component';
import { AvailableRoomsComponent } from './components/available-rooms/available-rooms.component';
import { HotelComponent } from './components/hotel/hotel.component';
import { RoomComponent } from './components/room/room.component';
import { EventComponent } from './components/event/event.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { UserComponent } from './components/user/user.component';
import { environment } from 'src/environments/environment';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    NotFoundComponent,
    RoomsComponent,
    UpcomingReservationsComponent,
    FinalizedReservationsComponent,
    ReservationsAdminHotelComponent,
    CreateHotelComponent,
    RoomsAdminComponent,
    GraphMostPopularComponent,
    ReservationsByHotelComponent,
    UsersComponent,
    GuestsComponent,
    InvoiceComponent,
    ProfileComponent,
    EventsComponent,
    ActiveEventsComponent,
    FinalizedEventsComponent,
    SearchPipe,
    ViewHotelsComponent,
    RoomsComponent,
    HotelsComponent,
    AvailableRoomsComponent,
    HotelComponent,
    RoomComponent,
    EventComponent,
    ReservationComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
