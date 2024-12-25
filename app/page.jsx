"use client"
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";


const ICAFE_MEMBERS_API =
  "https://api.icafecloud.com/api/v2/cafe/78949/members/action/suggestMembers";
const ICAFE_AUTH_TOKEN =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNjlhZTIyNDNjZjRiYTlmMmRlYzAxYWQ4MjNjNTBjYWE2NGNiZWU5NjkzMGQ5ZmEyZTY0MWM2MDZmOTdkZjE5NDY5YWFkMGJmNTVkZGFmNjciLCJpYXQiOjE3MzQ0MjI4NzUuOTYwMDg1LCJuYmYiOjE3MzQ0MjI4NzUuOTYwMDg3LCJleHAiOjE3NjU5NTg4NzUuOTU4MDc5LCJzdWIiOiIzODQxMTkwMTI4Nzg5NDkiLCJzY29wZXMiOltdfQ.JTuAqQibEtsSGZcbk5adaA-SeY2sOlMy69A7bEcrA-McUg2a5zdxJZTwIPTm9pzaPQIzsiXZMffgXYUA5Zf23RYJTqGErb6vkWeaYXMQLdn6tzownZhzKD-SpCbsoHK5BGYpqpDLMnPevxgJ43bOBKYkIzuraxsip1qcuSdvjtcrfK4avU02XP2KQq7qMLWasZ5QM12rgghQIX0fahwwK7FOtzeylgzqCGC38mnxuaj6-p3G_V5A_enoPgUDtJm58-0xCVg9aI3i-Cer5S9D6pfnMVXYeuss6BJm2clg1QAvJx9Z5nHJX2zrOJUq5W017bwWYY2NRRSu1OT0HBN3me63FRRdT9TJOMeR1Wcm0ppCZihDWkLmuQ00nnq09LijRIKg5US68Tyg8Hni58oyKbjf90X1FHIzYzxA7vkmXc3h_2q7PAAD7_OQlVyBiaXMg8pS3N-uxIuoLUMbQlx9MYxeQk1A0iTggzHGlTD2TohWE0yW2LNjdTUah9J9Oi7ifY_BO7jrKQlxpJTq_KMJ6NApcukECZTO-Oe9i__54qYgWIMlCkl39ibtfJe3R9_8zX9uhgK3vLgDYgP5Z_Y_wuz0uj3FgE7lI55tGB4UVJuyW8S0R0Dx77UV_ue5Gr-RkXcGB5-eV7okJqX5TujUp5Jur-vN5-JWrJanga-jwIE";

const Page = () => {
  const router = useRouter()
  const [userID, setUserID] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [memberError, setMemberError] = useState("");

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  };

  const fetchICafeMember = async (memberId) => {
    const url = `${ICAFE_MEMBERS_API}?search_text=${memberId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: ICAFE_AUTH_TOKEN,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (data.code === 200 && data.data.length > 0) {
        console.log("Member Found:", data.data[0]);
        return data.data[0];
      } else {
        console.error("No member found with ID:", memberId);
        return false;
      }
    } catch (error) {
      console.error("Error fetching member:", error);
      return false;
    }
  };

  const handlePayment = async () => {
    if (!userID.trim() || !amount.trim()) {
      setError(true);
      return;
    }

    if (parseInt(amount) < 1000) {
      setAmountError("Сумма должна быть не менее 1000");
      return;
    }
    setAmountError("");
    setError(false);

    const memberExists = await fetchICafeMember(userID);
    if (!memberExists) {
      setMemberError("Пользователь с таким ID не найден");
      return;
    }

    setMemberError("");

    const generatedId = generateUniqueId();
    const generatedOrderId = generateUniqueId();

    const amountInCents = parseInt(amount) * 100;

    const payload = {
      id: generatedId,
      method: "receipts.create",
      params: {
        amount: amountInCents,
        account: {
          order_id: generatedOrderId,
        },
      },
    };

    try {
      const response = await fetch("https://checkout.paycom.uz/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth":
            "675ac1ca47f4e3e488ef4791:krd&yymqu#mU1K4Uo%3o28trTEwB5E@T2XCP",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data?.result?.receipt?._id) {
        const transactionId = data.result.receipt._id;
        setTransactionId(transactionId);
        console.log("Payment Response:", data);

        router.push(`/qr?userId=${userID}&transactionId=${transactionId}&amount=${amount}`);
      } else {
        console.error("Failed to get transaction ID from response:", data);
      }
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  const handlePaymentClick = async () => {
    if (!userID.trim() || !amount.trim()) {
      setError(true);
      return;
    }

    if (parseInt(amount) < 1000) {
      setAmountError("Сумма должна быть не менее 1000");
      return;
    }
    setAmountError("");
    setError(false);

    const memberExists = await fetchICafeMember(userID);
    if (!memberExists) {
      setMemberError("Пользователь с таким ID не найден");
      return;
    }

    setMemberError("");

    router.push(`/clickqr?&amount=${amount}&memberId=${memberExists.member_id}`);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#000',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <img
        src="./cyberclub.svg"
        alt="Game Point Logo"
        style={{
          width: '150px',
          marginBottom: '20px',
        }}
      />

      <input
        type="text"
        style={{
          width: '300px',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '16px',
        }}
        placeholder="Напишите свой ID"
        value={userID}
        onChange={(e) => setUserID(e.target.value)}
      />

      <input
        type="number"
        style={{
          width: '300px',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '16px',
        }}
        placeholder="Введите сумму (не меньше 1000)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="1000"
      />

      {amountError && (
        <p style={{ color: 'red', marginBottom: '10px' }}>{amountError}</p>
      )}
      {memberError && (
        <p style={{ color: 'red', marginBottom: '10px' }}>{memberError}</p>
      )}
      {error && !amountError && !memberError && (
        <p style={{ color: 'red', marginBottom: '10px' }}>
          Пожалуйста, введите свой ID и сумму
        </p>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
          }}
          onClick={handlePaymentClick}
        >
          CLICK
        </button>
        <button
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
          }}
          onClick={handlePayment}
        >
          PAYME
        </button>
      </div>
    </div>
  );
};

export default Page;
