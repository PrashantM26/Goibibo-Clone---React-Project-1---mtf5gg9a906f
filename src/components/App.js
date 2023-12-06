import "../styles/App.css";
import React, { useEffect } from "react";
import { Routes, Route } from 'react-router-dom'
import { Navbar } from "./navbar/Navbar";
import { Flights } from "./navbar/nav-comp/Flights/Flights"
import { Hotels } from "./navbar/nav-comp/Hotels/Hotels"
import { Trains } from "./navbar/nav-comp/Trains/Trains"
import { Cabs } from "./navbar/nav-comp/Cabs/Cabs"
import { Bus } from "./navbar/nav-comp/Bus/Bus"
import { Holidays } from "./navbar/nav-comp/Holidays"
import { Forex } from "./navbar/nav-comp/Forex"
import { MySupportTrips } from "./navbar/nav-comp/MySupportTrips"
import { Profile } from "./Profile"
import { Login } from "./navbar/nav-comp/LoginSignup"
import { Signup } from "./navbar/nav-comp/LoginSignup"

function App() {

  return(
    <div>
      <Navbar />
      <Routes>
        <Route path="/flights" element={<Flights />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/trains" element={<Trains />} />
        <Route path="/cabs" element={<Cabs />} />
        <Route path="/bus" element={<Bus />} />
        <Route path="/holidays" element={<Holidays />} />
        <Route path="/forex" element={<Forex />} />
        <Route path="/mysupport/trips" element={<MySupportTrips />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App;
