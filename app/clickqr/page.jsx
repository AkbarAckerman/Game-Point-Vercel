"use client";
import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "@/app/clickqr/style.css";
import axios from "axios";

const ICAFE_AUTH_TOKEN =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNjlhZTIyNDNjZjRiYTlmMmRlYzAxYWQ4MjNjNTBjYWE2NGNiZWU5NjkzMGQ5ZmEyZTY0MWM2MDZmOTdkZjE5NDY5YWFkMGJmNTVkZGFmNjciLCJpYXQiOjE3MzQ0MjI4NzUuOTYwMDg1LCJuYmYiOjE3MzQ0MjI4NzUuOTYwMDg3LCJleHAiOjE3NjU5NTg4NzUuOTU4MDc5LCJzdWIiOiIzODQxMTkwMTI4Nzg5NDkiLCJzY29wZXMiOltdfQ.JTuAqQibEtsSGZcbk5adaA-SeY2sOlMy69A7bEcrA-McUg2a5zdxJZTwIPTm9pzaPQIzsiXZMffgXYUA5Zf23RYJTqGErb6vkWeaYXMQLdn6tzownZhzKD-SpCbsoHK5BGYpqpDLMnPevxgJ43bOBKYkIzuraxsip1qcuSdvjtcrfK4avU02XP2KQq7qMLWasZ5QM12rgghQIX0fahwwK7FOtzeylgzqCGC38mnxuaj6-p3G_V5A_enoPgUDtJm58-0xCVg9aI3i-Cer5S9D6pfnMVXYeuss6BJm2clg1QAvJx9Z5nHJX2zrOJUq5W017bwWYY2NRRSu1OT0HBN3me63FRRdT9TJOMeR1Wcm0ppCZihDWkLmuQ00nnq09LijRIKg5US68Tyg8Hni58oyKbjf90X1FHIzYzxA7vkmXc3h_2q7PAAD7_OQlVyBiaXMg8pS3N-uxIuoLUMbQlx9MYxeQk1A0iTggzHGlTD2TohWE0yW2LNjdTUah9J9Oi7ifY_BO7jrKQlxpJTq_KMJ6NApcukECZTO-Oe9i__54qYgWIMlCkl39ibtfJe3R9_8zX9uhgK3vLgDYgP5Z_Y_wuz0uj3FgE7lI55tGB4UVJuyW8S0R0Dx77UV_ue5Gr-RkXcGB5-eV7okJqX5TujUp5Jur-vN5-JWrJanga-jwIE";


const ClickQr = () => {
  const [userID, setUserID] = useState(null);
  const [amount, setAmount] = useState(null);
  const [transactionParam, setTransactionParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentState, setPaymentState] = useState(null);

  console.log("IDDDDD", userID);

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
