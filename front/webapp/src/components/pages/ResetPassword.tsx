import { useEffect, useState } from "react";
import Input from "../Input";
import { Button } from "../Button";
import "./ResetPassword.css";
import Title from "../Title";
import axios from "axios";
import { Store } from "react-notifications-component";

type PasswordProps = {
  title: string;
  description: string;
  setInput: (value: string) => void;
  value: string;
  placeholder: string;
  type: string;
  onClick: () => void;
  buttonText: string;
};

const Password = (props: PasswordProps) => {
  return (
    <div className="flex-container">
      <Title title={props.title} />
      <div style={{ fontWeight: 500, fontSize: 25 }}>{props.description}</div>
      <Input
        onChange={(e) => props.setInput(e.target.value)}
        placeholder={props.placeholder}
        type={props.type}
        value={props.value}
      />
      <Button
        buttonSize="btn--large"
        buttonStyle="btn--primary-inverted"
        type="button"
        onClick={props.onClick}
      >
        Submit
      </Button>
    </div>
  );
};

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = () => {
      const queryParams = new URLSearchParams(window.location.search);
      const tempToken = queryParams.get("token");
      if (tempToken) {
        setToken(tempToken);
      }
    };
    getToken();
  }, []);

  const changePassword = async () => {
    try {
        const res = await axios.post('http://localhost:8080/reset/password', { token, newPassword: password }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
        if (res && res.status === 200) {
          Store.addNotification({
            title: "Password successfully changed",
            message:
              "You can now log in using your new password",
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          });
        }
      } catch (e: any) {
        Store.addNotification({
          title: "Error",
          message: "test",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
        console.error("Error while trying to reset password : ", e);
      }
  }

  const sendEmail = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/reset/request-password-reset",
        { email }
      );
      if (res && res.status === 200) {
        Store.addNotification({
          title: "Mail successfully sent",
          message:
            "Please click on the link sent to your email to reset your password",
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      }
    } catch (e: any) {
      Store.addNotification({
        title: "Error",
        message: e.response.data.message,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
      console.error("Error while trying to reset password : ", e);
    }
  };
  return (
    <div className="reset-password">
      {!token ? (
        <Password
          title="Forgot your password ?"
          buttonText="Submit"
          description="Enter your email and submit, we will then send you a mail to reset your
        password"
          onClick={sendEmail}
          setInput={setEmail}
          value={email}
          placeholder="Email"
          type="email"
        />
      ) : (
        <Password
          buttonText="Change Password"
          description="Enter your new Password"
          title="Change your password"
          onClick={changePassword}
          placeholder="New password"
          setInput={setPassword}
          type="password"
          value={password}
        />
      )}
    </div>
  );
}
