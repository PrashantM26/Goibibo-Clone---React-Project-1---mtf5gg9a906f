import React from "react";
import { useState, useEffect } from "react";

export const GetToTopButton = () => {
    const [toTop, setToTop] = useState(false);
    useEffect(() => {
        window.addEventListener('scroll', () => {
            if(window.scrollY > 2000){
                setToTop(true)
            }
            else{
                setToTop(false);
            }
        })
    },[])

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    return (
        <div>
            {toTop && (
                <button style={{
                    position: "fixed",
                    bottom: "250px",
                    left: "200px",
                    height: "50px",
                    width: "150px",
                    fontSize: "20px"
                }}
                onClick={scrollUp}
                >Back to Top ^</button>
            )}
        </div>
    )
}