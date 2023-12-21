import "../styles/App.css";
import React, { useEffect } from "react";
import { Routes, Route } from 'react-router-dom'
import { Navbar } from "./navbar/Navbar";
import { Flights } from "./navbar/nav-comp/Flights/Flights"
import { FlightBooking } from "./navbar/nav-comp/Flights/FlightBooking"
import { Hotels } from "./navbar/nav-comp/Hotels/Hotels"
import { HotelDetails } from "./navbar/nav-comp/Hotels/HotelDetails"
import { HotelBooking } from "./navbar/nav-comp/Hotels/HotelBooking"
import { Trains } from "./navbar/nav-comp/Trains/Trains"
import { Bus } from "./navbar/nav-comp/Bus/Bus"
import { BusBooking } from "./navbar/nav-comp/Bus/BusBooking"
import { BookingList } from "./navbar/nav-comp/MyBookings/BookingList";
import { Login } from "./navbar/nav-comp/Authentication/LoginSignup"
import { SignUp } from "./navbar/nav-comp/Authentication/LoginSignup"
import { AuthProvider } from "./navbar/nav-comp/Authentication/AuthProvider";
import { AuthNavigator } from "./navbar/nav-comp/Authentication/AuthNavigator";

function App() {

  return(
    <div>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/flights" element={<AuthNavigator><Flights /></AuthNavigator>} />
          <Route path="/flights/:id" element={<FlightBooking />} />
          <Route path="/hotels" element={<AuthNavigator><Hotels /></AuthNavigator>} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          <Route path="/hotels/:id/booking" element={<HotelBooking />} />
          {/*<Route path="/trains" element={<Trains />} />*/}
          <Route path="/bus" element={<AuthNavigator><Bus /></AuthNavigator>} />
          <Route path="/bus/:id" element={<BusBooking />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bookinglist" element={<AuthNavigator><BookingList /></AuthNavigator>} />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App;
