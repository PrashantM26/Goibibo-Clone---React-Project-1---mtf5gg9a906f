/*import React, { useState, useEffect } from "react";

export const SelectGuestRoom = () => {
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [showGuestroom, setShowGuestRoom] = useState(false);
    const [updateLabel, setUpdateLabel] = useState(false);
    const [selectedValues, setSelectedValues] = useState({ adults, children, rooms });
  
    const handleGuestRoom = () => {
      setShowGuestRoom(!showGuestroom);
    }
  
    const incDec = (inDc, setVal) => {
      if (inDc === 'inc') {
        setVal((val) => val + 1);
      } else {
          setVal((val) => {
            if (val > 0) {
              return val - 1;
            } else {
              return val;
            }
          });
        }
      }
  
      useEffect(() =>
        {
          setSelectedValues({ adults, children, rooms });
  
        }
        ,[updateLabel])
  
      return (
        <div>
           <div>
              <label htmlFor="guestRooms">Guests & Rooms</label>
              <label className="grNonEditable" contentEditable="false" onClick={handleGuestRoom}>
              {selectedValues.adults} Adult | {selectedValues.children} Child | {selectedValues.rooms} Room
              </label>
           </div>
        
          {showGuestroom ? (
            null
          ) : (
            <div>
              <div>
                <span>Rooms (Max 8)</span>
                <button onClick={() => incDec('dec', setRooms)}>-</button>
                <span>{rooms}</span>
                <button onClick={() => incDec('inc', setRooms)}>+</button>
              </div>
              <div>
                <span>Adults (12+ yr)</span>
                <button onClick={() => incDec('dec', setAdults)}>-</button>
                <span>{adults}</span>
                <button onClick={() => incDec('inc', setAdults)}>+</button>
              </div>
              <div>
                <span>Children (0-12 yr)</span>
                <button onClick={() => incDec('dec', setChildren)}>-</button>
                <span>{children}</span>
                <button onClick={() => incDec('inc', setChildren)}>+</button>
              </div>
              <button className="searchBtn" onClick={() => setUpdateLabel(!updateLabel)}>Done</button>
            </div>
          )}
        </div>
      );
  };*/



/*import React, { useState } from 'react';

export const SelectGuestRoom = ({ passedVals }) => {
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showGuestroom, setShowGuestRoom] = useState(false);
  const [selectedValues, setSelectedValues] = useState({ adults, children, rooms });

  const handleGuestRoom = () => {
    setShowGuestRoom(!showGuestroom);
  };

  const incDec = (inDc, setVal) => {
    if (inDc === 'inc') {
      setVal((val) => val + 1);
    } else {
      setVal((val) => (val > 0 ? val - 1 : val));
    }
  };

  const handleDoneClick = () => {
    const updatedValues = {
      adults,
      children,
      rooms
    };
    setSelectedValues(updatedValues);
    passedVals(updatedValues);
    setShowGuestRoom(false);
  };

  return (
    <div>
      <div>
        <label htmlFor="guestRooms">Guests & Rooms</label>
        <label className="grNonEditable" contentEditable="false" onClick={handleGuestRoom}>
          {selectedValues.adults} Adults | {selectedValues.children} Children | {selectedValues.rooms} Rooms
        </label>
      </div>

      {showGuestroom ? (
        <div>
          <div>
            <span>Rooms (Max 8)</span>
            <button onClick={() => incDec('dec', setRooms)}>-</button>
            <span>{rooms}</span>
            <button onClick={() => incDec('inc', setRooms)}>+</button>
          </div>
          <div>
            <span>Adults (12+ yr)</span>
            <button onClick={() => incDec('dec', setAdults)}>-</button>
            <span>{adults}</span>
            <button onClick={() => incDec('inc', setAdults)}>+</button>
          </div>
          <div>
            <span>Children (0-12 yr)</span>
            <button onClick={() => incDec('dec', setChildren)}>-</button>
            <span>{children}</span>
            <button onClick={() => incDec('inc', setChildren)}>+</button>
          </div>
          <button className="searchBtn" onClick={handleDoneClick}>
            Done
          </button>
        </div>
      ) : null}
    </div>
  );
};*/









import React, { useState, useEffect } from 'react';

export const SelectGuestRoom = ({ passedVals }) => {
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showGuestroom, setShowGuestRoom] = useState(false);
  const [selectedValues, setSelectedValues] = useState({ adults, children, rooms });

  useEffect(() => {

    if (adults > rooms * 2) {
      setRooms(Math.ceil(adults / 2));
    }

    if (children > rooms * 4) {
      alert('Number of children can only be 4 times the number of rooms.');
      setChildren(rooms * 4);
    }

    if (rooms > 4) {
      alert('Maximum number of rooms allowed is 4.');
      setRooms(4);
    }

    if (adults > 8) {
      alert('Maximum number of adults is 8.');
      setAdults(8);
    }

    if (adults < rooms) {
      setRooms(adults);
    }
  }, [adults, children, rooms]);

  const handleGuestRoom = () => {
    setShowGuestRoom(!showGuestroom);
  };

  const incDec = (inDc, setVal, relatedVal, setRelatedVal) => {
    if (inDc === 'inc') {
      setVal((val) => val + 1);
    } else {
      setVal((val) => (val > 0 ? val - 1 : val));
    }

    if (relatedVal < rooms) {
      setRooms(relatedVal);
    }
  };

  const handleDoneClick = () => {
    const updatedValues = {
      adults,
      children,
      rooms,
    };
    setSelectedValues(updatedValues);
    passedVals(updatedValues);
    setShowGuestRoom(false);
  };

  return (
    <div>
      <div className='child2'>
        <p>Guests & Rooms</p>
        <p className="grNonEditable" contentEditable="false" onClick={handleGuestRoom}>
          {selectedValues.adults} Adults | {selectedValues.children} Children | {selectedValues.rooms} Rooms
        </p>
      </div>

      {showGuestroom ? (
        <div className='passengerWindowH'>
          <div className='roomsNoH'>
            <span>Rooms (Max 2)</span>
            <div>
              <button className="decBtnH" onClick={() => incDec('dec', setRooms, adults, setAdults)}>-</button>
              <span>{rooms}</span>
              <button className='incBtnH' onClick={() => incDec('inc', setRooms, adults, setAdults)}>+</button>
            </div>
          </div>
          <div className='adultsNoH'>
            <span>Adults (12+ yr)</span>
            <div>
              <button className="decBtnH" onClick={() => incDec('dec', setAdults, rooms, setRooms)}>-</button>
              <span>{adults}</span>
              <button className='incBtnH' onClick={() => incDec('inc', setAdults, rooms, setRooms)}>+</button>
            </div>
          </div>
          <div className='childrenNoH'>
            <span>Children (0-12 yr)</span>
            <div>
              <button className="decBtnH" onClick={() => incDec('dec', setChildren)}>-</button>
              <span>{children}</span>
              <button className='incBtnH' onClick={() => incDec('inc', setChildren)}>+</button>
            </div>
          </div>
          <button className="closeRoomPassWindowButton" onClick={handleDoneClick}>
            Done
          </button>
        </div>
      ) : null}
    </div>
  );
};