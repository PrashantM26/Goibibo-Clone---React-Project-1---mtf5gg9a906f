import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./MyBookings.css";

export const BookingList = () => {
  const [bookings, setBookings] = useState([]);
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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
        fetchBookings();
  }, []);
  console.log(bookings)
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
  </div>
  );
};