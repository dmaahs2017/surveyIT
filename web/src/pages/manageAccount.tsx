import React from "react";
import { NavBar } from "../components/NavBar";

const manageAccount: React.FC<{}> = ({}) => {

    return (
      <div>
        
        <NavBar />
            <h1 className="title">Account</h1>
            <div className="container">
                <div className="userInfo">
                    <img className="profilePic" src="https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" />
                    <p style={{textAlign:"center"}}>AccountName</p>
                    { /* delte from here */}
                    <p>Name</p>
                    <input className="simpleField" type="text" />
                    <p>Email</p>
                    <input className="simpleField" type="email" />
                    <p>Password</p>
                    <input className="simpleField" type="password" />
                    <p>Phone Number</p>
                    <input className="simpleField" type="text" />
                    <p>Income</p>
                    <input className="simpleField" type="text" />
                    <p>Education</p>
                    <input className="simpleField" type="text" />
                    <p>Gender</p>
                    <input className="simpleField" type="text" />
                    <p></p>
                    <button>Edit Account</button>
                { /* To Here */}
                </div>
            </div>
      </div>
    );
  };
  
  export default manageAccount;
  