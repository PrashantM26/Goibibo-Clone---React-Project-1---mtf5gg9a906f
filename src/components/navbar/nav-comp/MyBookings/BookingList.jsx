import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./MyBookings.css";

export const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  //const [flight, setFlight] = useState(false)
  //const [hotel, setHotel] = useState(false);
  //const [bus, setBus] = useState(false);
  //const [filData, setFilData] = useState([]);
  //const [checked, setChecked] = useState([]);
  const token = sessionStorage.getItem("user-token")
  const bookingData_config = {
    headers: {
        Authorization: `Bearer ${token}`,
        projectID: 'zvc3foel7gfi',
    },
  }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          'https://academics.newtonschool.co/api/v1/bookingportals/booking',
          bookingData_config
        );
  
        const bookingData = response.data.data;
        setBookings(bookingData);
        //setFilData(bookingData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
        fetchBookings();
  }, []);



  /*useEffect(() => {                                           //Didn't work for that additional checkbox filter demand
      //let filData = bookings;
      if(flight){
        let fliData = bookings.filter((book) => (
          book.booking_type === "flight"
        ))
        setFilData((prev) => [...prev, fliData])
      }
      if(hotel){
        let holData = bookings.filter((book) => (
          book.booking_type === "hotel"
        ))
        setFilData((prev) => [...prev, holData])
      }
      if(bus){
        let busData = bookings.filter((book) => (
          book.booking_type === "bus"
        ))
        setFilData((prev) => [...prev, busData])
      }

  }, [flight, hotel, bus])*/

  {/*const handleCheckbox = (type) => {                  //Was told o implement addidtional checkbox filters
    setChecked((prev) => {
      if(prev.includes(type)) {
        return prev.filter((selectedType) => selectedType !== type);
      }
      else{
        return [...prev, type];
      }
    })
  }

  useEffect(() => {
    let filtData = bookings;
    if(checked.length>0){
      filtData = filtData.filter((item) => {
        return checked.includes(item.booking_type);
      })
      setFilData(filtData);
    }
    else{
      setFilData(bookings);
    }
  }, [checked])*/}

  

  //console.log(bookings)
  return (
    <div>
    <h2 className="table-heading">Booking Details</h2>
    <table className="booking-table">
      <thead>
        <tr>
          <th className="user-name">User Name</th>
          <th className="start-date">Start Date</th>
          <th className="end-date">End Date</th>
          <th className="status">Status</th>
          <th className="booking-type">Booking Type</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map(booking => (
          <React.Fragment key={booking._id}>
            <tr>
                <td>{booking.user.name}</td>
                <td>{booking.start_date}</td>
                <td>{booking.end_date}</td>
                <td>{booking.status}</td>
                <td>
                    {booking.booking_type}
                    {booking.booking_type === 'hotel' && (
                    <React.Fragment>
                        <br />
                        <span className="hotel-name">Hotel Name: {booking.hotel && booking.hotel.name}</span>
                    </React.Fragment>
                    )}
                </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
    {/*<div>
      <label for="c1"> Flights<input className="c1" type='checkbox' onClick={() => handleCheckbox("flight")}/></label>&nbsp;
      <label for="c2"> Hotels<input className="c2" type='checkbox' onClick={() => handleCheckbox("hotel")}/></label>&nbsp;
      <label for="c3"> Bus<input className="c3" type='checkbox' onClick={() => handleCheckbox("bus")}/></label>&nbsp;
    </div>*/}
  </div>
  );
};