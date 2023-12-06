import React, { useState } from 'react';

export const SelectPassenger = ({ passedVals }) => {

  const [showPassenger, setPassenger] = useState(false);
  const [selVal, setSelVal] = useState({ adults : 1, children : 0, infants : 0, ticketType : "" });


  const handlePassenger = () => {
    setPassenger(!showPassenger);
  };


  const incDec = (inDc, setVal, key) => {
    if (inDc === 'inc') {
      setVal((obj) => {
        return { ...obj, [key] : obj[key] + 1 }
      });
  
    } else {
      setVal((obj) => (
        {...obj, [key] : (obj[key] > 0 ? obj[key] - 1 : obj[key])}
      ));
    }
  };



  const handleDoneClick = () => {
    passedVals(selVal);
    setPassenger(false);
  };



  return (
    <div>
    
        < div className="child1">  
                <label>Passenger & class</label>
                <div style={{height:"98%",padding:"15px",backgroundColor:"rgb(25, 88, 182)",borderRadius:"8px"}} onClick={handlePassenger}  >
                    {selVal.adults} Adults, {selVal.children>0 ? `${selVal.children} Children, ` : null }{selVal.infants>0 ? `${selVal.infants} Infants` : null }
                    {selVal.ticketType}
                </div>
        </div>
        
      {showPassenger ? (
        <div>
          <div>
            <span>Adults (12+ yrs)</span>
            <button onClick={() => incDec('dec', setSelVal, 'adults')}>-</button>
            <span>{selVal.adults}</span>
            <button onClick={() => incDec('inc', setSelVal, 'adults')}>+</button>
          </div>
          <div>
            <span>Children (2-12 yrs)</span>
            <button onClick={() => incDec('dec', setSelVal, 'children')}>-</button>
            <span>{selVal.children}</span>
            <button onClick={() => incDec('inc', setSelVal, 'children')}>+</button>
          </div>
          <div>
            <span>Infants (Below 2 yrs)</span>
            <button onClick={() => incDec('dec', setSelVal, 'infants')}>-</button>
            <span>{selVal.infants}</span>
            <button onClick={() => incDec('inc', setSelVal, 'infants')}>+</button>
          </div>
          <div>
            Travel class: <select onChange={(e)=>{
                setSelVal((obj) => ({
                    ...obj,
                    ticketType : e.target.value
                  }))
            }}>
                <option>First Class</option>
                <option>Econmony</option>
                <option>Business</option>
                <option>Premium Econmony</option>
            </select>
          </div>
          <button className="searchBtn" onClick={handleDoneClick}>
            Done
          </button>
        </div>
      ) : null}
    </div>
  );
};








{/*<div style={{display:"flex",justifyContent:"center"}}>
            <div>
                    <label>Adults</label>   <h1>{adult}</h1>
                    <button onClick={()=>{handleCount(-1)}}>-</button>
                 
                    <button  onClick={()=>{handleCount(1)}}>+</button>
            </div>

            <div>
                    <label>Children</label>   <h1>{children}</h1>
                    <button onClick={()=>{
                        if(children-1 !==-1)
                        {
                        setChildren(children-1);
                        setCount(count-1);
                        }
                        }}>-</button>
                 
                    <button  onClick={()=>{setChildren(children+1); setCount(count+1);}}>+</button>
            </div>

            <div>
                    <label>Infants</label>   <h1>{infant}</h1>
                    <button onClick={()=>{
                        if(infant-1 !==-1)
                        {
                            setInfant(infant-1);
                        setCount(count-1);
                        }
                        }}>-</button>
                 
                    <button  onClick={()=>{setInfant(infant+1); setCount(count+1);}}>+</button>
                        <br></br>
                   
            </div>

            </div>

            <div>
            Travel class: <select onChange={(e)=>{
               
                setTickettype(e.target.value)
            }}>
                        <option>First Class</option>
                        <option>Econmony</option>
                        <option>Business</option>
                        <option>Premium Econmony</option>
            </select>
            </div>
            </div>}


        </div>*/}