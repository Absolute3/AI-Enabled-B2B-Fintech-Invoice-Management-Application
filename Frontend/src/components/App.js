import React from "react";
import MyGrid from "./MyGrid";
import Footer from './Footer';
import Toplogo from "./TopBar";

export default function App() {
return <div>
            <Toplogo />
            <div className = "title">
                <h2 style = {{color : "white"}}>Invoice List</h2>
            </div>
            <MyGrid />
            <div style = {{paddingDown : 25}}></div>
            <div className = "footer">
            <Footer />
            </div> 
        </div>
}