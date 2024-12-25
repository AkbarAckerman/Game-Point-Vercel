"use client";
import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "@/app/clickqr/style.css";
import axios from "axios";

const ClickQr = () => {
  const [userID, setUserID] = useState(null);
  const [amount, setAmount] = useState(null);
  const [transactionParam, setTransactionParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentState, setPaymentState] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Extract query parameters in the browser environment
      const urlParams = new URLSearchParams(window.location.search);
      setUserID(urlParams.get("memberId"));
      setAmount(urlParams.get("amount"));
    }
  }, []);

  // Generate a unique transaction parameter
  useEffect(() => {
    const generateTransactionParam = () => {
      return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    };
    setTransactionParam(generateTransactionParam());
  }, []);

  const paymentURL = userID
    ? `https://my.click.uz/services/pay?service_id=39903&merchant_id=30020&amount=${amount}&transaction_param=${transactionParam}`
    : null;

  const checkPaymentStatus = async () => {
    const { data } = await axios.get(
      `/api/getClick?transactionParam=${transactionParam}`
    );

    console.log("st2", data);

    if (data.data.error_code === 0 && data.data.payment_status === 2) {
      topUpMember(userID);
    } else {
      console.log("error");
    }
  };

  const topUpMember = async (memberId) => {
    const payload = {
      topup_ids: String(memberId),
      topup_value: `${parseFloat(amount).toFixed(2)}`,
      comment: "The payment was made",
    };

    try {
      const response = await fetch(
        "https://api.icafecloud.com/api/v2/cafe/78949/members/action/topup",
        {
          method: "POST",
          headers: {
            Authorization: ICAFE_AUTH_TOKEN,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("Top-up response:", data);

      if (data.code === 200) {
        console.log("Top-up successful:", data);
      } else {
        console.error("Top-up failed:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error during top-up:", error);
    }
  };

  return (
    <div className="qr-page">
      <h1>Scan QR to Pay</h1>
      {transactionParam && userID && amount ? (
        <>
          <QRCodeCanvas value={paymentURL} size={256} />
          <p>Amount: {amount}</p>
          <button className="btn" onClick={checkPaymentStatus}>
            Проверить оплату
          </button>
        </>
      ) : (
        <p>Generating QR code...</p>
      )}
    </div>
  );
};

export default ClickQr;
