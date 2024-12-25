"use client";
import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const PAYMENT_API_URL = "https://checkout.paycom.uz/api";
const PAYMENT_AUTH =
  "675ac1ca47f4e3e488ef4791:krd&yymqu#mU1K4Uo%3o28trTEwB5E@T2XCP";

const ICAFE_MEMBERS_API =
  "https://api.icafecloud.com/api/v2/cafe/78949/members/action/suggestMembers";
const ICAFE_AUTH_TOKEN =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNjlhZTIyNDNjZjRiYTlmMmRlYzAxYWQ4MjNjNTBjYWE2NGNiZWU5NjkzMGQ5ZmEyZTY0MWM2MDZmOTdkZjE5NDY5YWFkMGJmNTVkZGFmNjciLCJpYXQiOjE3MzQ0MjI4NzUuOTYwMDg1LCJuYmYiOjE3MzQ0MjI4NzUuOTYwMDg3LCJleHAiOjE3NjU5NTg4NzUuOTU4MDc5LCJzdWIiOiIzODQxMTkwMTI4Nzg5NDkiLCJzY29wZXMiOltdfQ.JTuAqQibEtsSGZcbk5adaA-SeY2sOlMy69A7bEcrA-McUg2a5zdxJZTwIPTm9pzaPQIzsiXZMffgXYUA5Zf23RYJTqGErb6vkWeaYXMQLdn6tzownZhzKD-SpCbsoHK5BGYpqpDLMnPevxgJ43bOBKYkIzuraxsip1qcuSdvjtcrfK4avU02XP2KQq7qMLWasZ5QM12rgghQIX0fahwwK7FOtzeylgzqCGC38mnxuaj6-p3G_V5A_enoPgUDtJm58-0xCVg9aI3i-Cer5S9D6pfnMVXYeuss6BJm2clg1QAvJx9Z5nHJX2zrOJUq5W017bwWYY2NRRSu1OT0HBN3me63FRRdT9TJOMeR1Wcm0ppCZihDWkLmuQ00nnq09LijRIKg5US68Tyg8Hni58oyKbjf90X1FHIzYzxA7vkmXc3h_2q7PAAD7_OQlVyBiaXMg8pS3N-uxIuoLUMbQlx9MYxeQk1A0iTggzHGlTD2TohWE0yW2LNjdTUah9J9Oi7ifY_BO7jrKQlxpJTq_KMJ6NApcukECZTO-Oe9i__54qYgWIMlCkl39ibtfJe3R9_8zX9uhgK3vLgDYgP5Z_Y_wuz0uj3FgE7lI55tGB4UVJuyW8S0R0Dx77UV_ue5Gr-RkXcGB5-eV7okJqX5TujUp5Jur-vN5-JWrJanga-jwIE";

const QRPage = () => {
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [userID, setUserID] = useState("");
  const [paymentState, setPaymentState] = useState(null);

  // Extract parameters from the URL safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setAmount(urlParams.get("amount"));
      setTransactionId(urlParams.get("transactionId"));
      setUserID(urlParams.get("userId"));
    }
  }, []);

  const handleVerifyPayment = async () => {
    const payload = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      method: "receipts.check",
      params: { id: transactionId },
    };

    try {
      const response = await fetch(PAYMENT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth": PAYMENT_AUTH,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.result) {
        const { state } = data.result;

        if (state === 4) {
          setPaymentState("success");
          console.log("Payment verified successfully. Fetching member...");
          fetchICafeMember(userID);
        } else {
          setPaymentState("failure");
          console.error(`Payment verification failed. State: ${state}`);
        }
      } else {
        setPaymentState("failure");
        console.error(
          "Payment verification error:",
          data.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error during payment verification:", error);
      setPaymentState("failure");
    }
  };

  const paymentURL = transactionId
    ? `https://checkout.paycom.uz/${transactionId}`
    : "";

  return (
    <div className="qr-page">
      <img src="./cyberclub.svg" alt="Game Point Logo" className="logo" />

      {paymentState === null ? (
        <>
          {paymentURL && <QRCodeCanvas value={paymentURL} size={256} />}
          <p>Отсканируйте QR-КОД</p>
          <button className="btn" onClick={handleVerifyPayment}>
            Проверить оплату
          </button>
        </>
      ) : paymentState === "success" ? (
        <div className="payment-success">
          <h1>✔</h1>
          <p>Оплата прошла успешно</p>
        </div>
      ) : (
        <div className="payment-failure">
          <h1>✘</h1>
          <p>Оплата не была выполнена</p>
        </div>
      )}
    </div>
  );
};

export default QRPage;
