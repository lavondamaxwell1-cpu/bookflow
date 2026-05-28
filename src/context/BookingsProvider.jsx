import { useEffect, useState } from "react";
import { BookingsContext } from "./bookingsContext";
import { bookings as sampleBookings } from "../data/bookings";

function BookingsProvider({ children }) {
  const [bookings, setBookings] = useState(() => {
    const savedBookings = localStorage.getItem("bookflowBookings");

    if (savedBookings) {
      return JSON.parse(savedBookings);
    }

    return sampleBookings;
  });

  useEffect(() => {
    localStorage.setItem("bookflowBookings", JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (bookingData) => {
    const newBooking = {
      id: Date.now(),
      customerName: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone,
      service: bookingData.service,
      date: bookingData.date,
      time: bookingData.time,
      status: "Pending",
      notes: bookingData.notes,
      createdAt: new Date().toISOString(),
    };

    setBookings((prevBookings) => [newBooking, ...prevBookings]);
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: newStatus,
            }
          : booking,
      ),
    );
  };

  const deleteBooking = (bookingId) => {
    setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking.id !== bookingId),
    );
  };

  const clearBookings = () => {
    localStorage.removeItem("bookflowBookings");
    setBookings(sampleBookings);
  };

  const value = {
    bookings,
    addBooking,
    updateBookingStatus,
    deleteBooking,
    clearBookings,
  };

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}

export default BookingsProvider;
