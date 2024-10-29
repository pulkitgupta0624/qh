import React, { useState, useEffect, useRef } from "react";
import {
  auth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "../../backend/controllers/firebaseController.js";
import { parsePhoneNumber, isValidNumber } from "libphonenumber-js";
import { useNavigate, useLocation } from "react-router-dom";

import Footer from "../components/Footer/Footer.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";

const OTPVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmResult, setConfirmResult] = useState(null);
  const [step, setStep] = useState("phone"); // "phone" or "otp"
  const [error, setError] = useState("");
  const recaptchaVerifierRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    initializeRecaptcha();
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const initializeRecaptcha = () => {
    if (!recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {
              console.log("reCAPTCHA solved successfully.");
            },
            "expired-callback": () => {
              initializeRecaptcha();
            },
          }
        );
      } catch (error) {
        console.error("Error initializing RecaptchaVerifier:", error);
      }
    }
  };

  const formatPhoneNumber = (number) => {
    try {
      if (number.length < 10) return null;
      const phoneNumberParsed = parsePhoneNumber(number, "IN");
      const validNumber = isValidNumber(phoneNumberParsed.number);
      return validNumber ? phoneNumberParsed.number : null;
    } catch (error) {
      console.error("Error formatting phone number:", error);
      return null;
    }
  };

  const handlePhoneSubmit = async () => {
    setError("");
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    if (!formattedPhoneNumber) {
      setError("Invalid phone number. Please try again.");
      return;
    }

    try {
      if (!recaptchaVerifierRef.current) {
        await initializeRecaptcha();
        if (!recaptchaVerifierRef.current) {
          throw new Error("Failed to initialize reCAPTCHA");
        }
      }

      const appVerifier = recaptchaVerifierRef.current;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        appVerifier
      );
      setConfirmResult(confirmationResult);
      setStep("otp");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
      await initializeRecaptcha();
    }
  };

  const verifyOTP = async () => {
    if (!confirmResult) {
      setError("No OTP confirmation available. Please try again.");
      return;
    }

    try {
      const result = await confirmResult.confirm(verificationCode);
      const accessToken = await result.user.getIdToken();
      const { uid } = result.user;
      const userInfo = {
        _id: uid,
        displayName: null,
        phone: result.user.phoneNumber,
        token: accessToken,
      };

      // Check if there's a redirectTo in the location state
      if (location.state && location.state.redirectTo) {
        navigate(location.state.redirectTo, { state: { fromOTP: true } });
      } else {
        navigate("/completeProfile", { state: { user: userInfo } });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <>
    <Navbar/>
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Phone Verification</h2>
        <p style={styles.subtitle}>
          {step === "phone"
            ? "Enter your phone number to receive a verification code"
            : "Enter the 6-digit code sent to your phone"}
        </p>
        {error && <div style={styles.error}>{error}</div>}
        {step === "phone" ? (
          <div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              style={styles.input}
            />
            <button onClick={handlePhoneSubmit} style={styles.button}>
              Send Verification Code
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit OTP"
              style={styles.input}
            />
            <button onClick={verifyOTP} style={styles.button}>
              Verify OTP
            </button>
          </div>
        )}
        <p style={styles.verifyMessage}>
          Please verify your phone number before proceeding to checkout.
        </p>
      </div>
      <div id="recaptcha-container"></div>
    </div>
    <Footer/>
    </>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Roboto', sans-serif",
  
  },
  formContainer: {
    maxWidth: "300px",
    width: "100%",
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "1rem",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#666",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1.2rem",
    borderRadius: "4px",
    border: "2px solid #ccc",
    marginBottom: "1rem",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "black",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  error: {
    color: "#d32f2f",
    marginBottom: "1rem",
    textAlign: "center",
  },
  verifyMessage: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#4caf50",
    textAlign: "center",
    fontWeight: "bold",
  },
};

export default OTPVerification;