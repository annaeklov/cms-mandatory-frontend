import "./App.css";
import react, { useState, useEffect } from "react";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import axios from "axios";
import Movies from "./components/Movies";
import Add from "./components/Add";
import Movie from "./components/Movie";
import Edit from "./components/Edit";
import styled from "styled-components";

const AppContainer = styled.div`
  box-sizing: border-box;
  background-color: #d0e2eb;
  height: 97vh;
  width: 100vw;
  font-family: "Roboto", sans-serif;
  main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    height: 100%;
    min-height: 97vh;
  }
  .divHeader {
    background-color: #a3c3d8;
    width: 100%;
    height: 22%;
    position: relative;
    align: center;
    box-shadow: 0px 10px 10px -7px #80a4c0;
    border-radius: 0px 0px 15px 15px;

    button {
      position: absolute;
      bottom: 20px;
      right: 15px;
      width: 116px;
      height: 49px;
      box-shadow: 0px 10px 10px -7px #80a4c0;
      background-color: #d0e2eb;
      border-radius: 15px;
      border: 2px solid #a3c3d8;
      display: inline-block;
      cursor: pointer;
      color: #456289;
      font-size: 16px;
      padding: 6px 12px;
      text-decoration: none;
    }
    button:hover {
      background-color: #80a4c0;
      color: #d0e2eb;
    }

    h1 {
      text-align: center;
      margin-top: 40px;
      color: #1d1b28;
      font-size: 50px;
    }
  }
`;

function App() {
  const [token, setToken] = useState("");
  const API_jwt = "http://localhost:8888/aewordpress/wp-json/jwt-auth/v1/token";

  function getToken() {
    let login = {
      username: "annaadmin",
      password: "annaadmin",
    };
    axios.post(API_jwt, login).then((resp) => {
      setToken(resp.data.token);
    });
    if (token) {
      <Redirect to="/" />;
    }
  }

  useEffect(() => {
    getToken();
  }, []);

  return (
    <BrowserRouter>
      <AppContainer>
        <Route exact path="/" component={() => <Movies token={token} />} />
        <Route path="/add" component={() => <Add token={token} />} />
        <Route path="/movie/:id" component={() => <Movie token={token} />} />
        <Route path="/edit/:id" component={() => <Edit token={token} />} />
      </AppContainer>{" "}
    </BrowserRouter>
  );
}

export default App;
