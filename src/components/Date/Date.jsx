import React from 'react';

export const DateComponent = ({ dateVal, type, setterFnc }) => {
  const date = new Date(dateVal);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const formattedDateFlights = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short', 
    year: '2-digit'
  });

  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
  
  const dayOfWeekFlights = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    
    if(type=='departure' || type=='return'){
      return setterFnc(formattedDateFlights)
    }
    else if(type=='shortDay' && typeof setterFnc === 'function' ){
      return setterFnc(() => dayOfWeek);
    }
    else if(type=="shortDay"){
      return dayOfWeek;
    }
    else{
      return formattedDate;
    }

}
