import axios from "axios";
import CryptoJS from "crypto-js";

const generateAuthHeader = () => {
  const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const secretKey = "JE000r78qw";
  const concatenatedString = `${timestamp}${secretKey}`;

  // Generate SHA1 hash
  const hashedString = CryptoJS.SHA1(concatenatedString).toString(
    CryptoJS.enc.Hex
  );

  return `49285:${hashedString}:${timestamp}`;
};

export async function GET(req, query) {
  const transactionParam = await req.nextUrl.searchParams.get(
    "transactionParam"
  );
  try {
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    const url = `https://api.click.uz/v2/merchant/payment/status_by_mti/39903/${transactionParam}/${currentDate}`;
    const authHeader = generateAuthHeader();

    console.log("GET URL IS:", url);
    console.log("generateAuthHeader", authHeader);

    const response = await axios.get(url, {
      headers: {
        Auth: authHeader,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("Payment Status:", response.data);
    return Response.json({ data: response.data, status: 200 });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return Response.json({ data: error, status: 500 });
  }
}
