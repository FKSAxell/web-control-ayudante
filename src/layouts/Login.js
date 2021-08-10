import React, { Component } from "react";
import "./Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Cookies from "universal-cookie";
import Logo from "../assets/svg/logo.svg";

const cookies = new Cookies();

class Login extends Component {
  state = {
    form: {
      username: "",
      password: "",
    },
  };
  handleChange = async (e) => {
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  iniciarSesion = async () => {
    console.log(`${process.env.REACT_APP_BACKURL}/api/login`);

    const json = JSON.stringify({
      email: this.state.form.username,
      password: this.state.form.password,
    });
    const headers = {
      "Content-Type": "application/json",
    };
    await axios
      .post(`${process.env.REACT_APP_BACKURL}/api/login`, json, {
        headers: headers,
      })
      .then((response) => {
        return response.data;
      })
      .then((response) => {
        console.log(response.ok);
        if (response.ok === true) {
          var usuario = response.usuario;
          cookies.set("id", usuario._id, { path: "/" });
          cookies.set("nombre", usuario.nombre, {
            path: "/",
          });
          cookies.set("email", usuario.email, {
            path: "/",
          });
          cookies.set("token", response.token, { path: "/" });
          cookies.set("rol", usuario.rol[0].nombre, { path: "/" });
          alert(`Bienvenido ${usuario.rol[0].nombre} ${usuario.nombre}`);
          window.location.href = "./admin";
        } else {
          alert("El usuario o la contraseña no son correctos");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    if (cookies.get("username")) {
      window.location.href = "./admin";
    }
  }

  render() {
    return (
      <div className="containerPrincipal">
        <div className="containerSecundario">
          <div className="turtleLogo">
            <img src={Logo} alt="Logo"></img>
          </div>

          <div
            style={{
              fontStyle: "bold",
              fontSize: "2rem",
              paddingBottom: "2rem",
            }}
          >
            Ingreso
          </div>

          <div className="inputContainer">
            <i className="fa fa-envelope-o icon"></i>
            <input
              type="text"
              className="inputField"
              placeholder="Correo"
              name="username"
              onChange={this.handleChange}
            />
          </div>

          <div className="inputContainer">
            <i className="material-icons icon">lock_outline</i>
            <input
              type="password"
              className="inputField"
              name="password"
              placeholder="Contrasena"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <button className="loginBtn" onClick={() => this.iniciarSesion()}>
              Ingresar
            </button>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <p>Términos y condiciones de uso</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;