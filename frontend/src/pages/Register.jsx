import '../../src/App.css';

import userService from '../assets/user.service';

import React, {useState } from "react";

const RegisterForm = () => {
  const[user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("")
  const [repeatedpass, SetRepeatpass] = useState("")

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser({...user, [name]:value})
  }

  const RegisterUser = (e) => {
    e.preventDefault();
    if (!repeatedpass) {
      return;
    }
    console.log("user", user)
    userService.saveUser(user)
      .then((res) => {
        console.log("User added successfully")
        setMsg("User added successfully")
        setUser({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
        })
      }).catch((error) => {
        console.log(error);
      });
      }
    
  const RepeatPassword = (e) => {
    const repeated_pass = e.target.value;
    SetRepeatpass(repeated_pass)
    if (user.password != repeated_pass) {
      console.log("Passwords don't match", user.password, repeated_pass)
      SetRepeatpass(false)
    } else {
      console.log("Passwords match")
      SetRepeatpass(true)
    }
  };

    return (
      <div className="container">
        <div className="card o-hidden border-0 shadow-lg my-5">
          <div className="card-body p-0">
            <div className="row">
              <div className="col-lg-7">
                <div className="p-5">
                  <div className="text-center">
                    <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                  </div>
                  <form className="user" onSubmit={(e) => {RegisterUser(e)}}>
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input type="text" name="firstname" className="form-control form-control-user" onChange={(e) => handleChange(e)} placeholder="First Name"/>
                      </div>
                      <div className="col-sm-6">
                        <input type="text" name="lastname" className="form-control form-control-user" onChange={(e) => handleChange(e)} placeholder="Last Name"/>
                      </div>
                    </div>
                    <div className="form-group">
                      <input type="text" name="email" className="form-control form-control-user" onChange={(e) => handleChange(e)} placeholder="Email Address"/>
                    </div>
                    <div className="form-group">
                      <input type="text" name="password" className="form-control form-control-user" onChange={(e) => handleChange(e)} value={user.password} placeholder="Password"/>
                    </div>
                    <div className="form-group">
                      <input type="text" name="repeatedpass" className="form-control form-control-user" onChange={(e) => RepeatPassword(e)} placeholder="Repeat Password"/>
                    </div>
                    <button className="btn btn-primary btn-user btn-block">Register Account</button>
                    <hr />
                  </form>
                  <hr />
                  <div className="text-center">
                    <a className="small" >Forgot Password?</a>
                  </div>
                  <div className="text-center">
                    <a className="small" >Already have an account? Login!</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default RegisterForm;