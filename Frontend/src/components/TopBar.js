import * as React from 'react';
import "../index.css"
import abclogo from "../images/abclogo.svg";
import hrclogo from "../images/hrclogo.svg"

export default function TopBar(){
    return <div>
        <img className = "abc-logo"src = {abclogo}  alt = "ABC Logo" />
        <img className = "highradius-logo" src ={hrclogo}  alt = "Highradius Logo" />    
    </div>
}