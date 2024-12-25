export async function GET(req, query) {
  const ICAFE_MEMBERS_API =
    "https://api.icafecloud.com/api/v2/cafe/78949/members/action/suggestMembers";
  const ICAFE_AUTH_TOKEN =
    "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNjlhZTIyNDNjZjRiYTlmMmRlYzAxYWQ4MjNjNTBjYWE2NGNiZWU5NjkzMGQ5ZmEyZTY0MWM2MDZmOTdkZjE5NDY5YWFkMGJmNTVkZGFmNjciLCJpYXQiOjE3MzQ0MjI4NzUuOTYwMDg1LCJuYmYiOjE3MzQ0MjI4NzUuOTYwMDg3LCJleHAiOjE3NjU5NTg4NzUuOTU4MDc5LCJzdWIiOiIzODQxMTkwMTI4Nzg5NDkiLCJzY29wZXMiOltdfQ.JTuAqQibEtsSGZcbk5adaA-SeY2sOlMy69A7bEcrA-McUg2a5zdxJZTwIPTm9pzaPQIzsiXZMffgXYUA5Zf23RYJTqGErb6vkWeaYXMQLdn6tzownZhzKD-SpCbsoHK5BGYpqpDLMnPevxgJ43bOBKYkIzuraxsip1qcuSdvjtcrfK4avU02XP2KQq7qMLWasZ5QM12rgghQIX0fahwwK7FOtzeylgzqCGC38mnxuaj6-p3G_V5A_enoPgUDtJm58-0xCVg9aI3i-Cer5S9D6pfnMVXYeuss6BJm2clg1QAvJx9Z5nHJX2zrOJUq5W017bwWYY2NRRSu1OT0HBN3me63FRRdT9TJOMeR1Wcm0ppCZihDWkLmuQ00nnq09LijRIKg5US68Tyg8Hni58oyKbjf90X1FHIzYzxA7vkmXc3h_2q7PAAD7_OQlVyBiaXMg8pS3N-uxIuoLUMbQlx9MYxeQk1A0iTggzHGlTD2TohWE0yW2LNjdTUah9J9Oi7ifY_BO7jrKQlxpJTq_KMJ6NApcukECZTO-Oe9i__54qYgWIMlCkl39ibtfJe3R9_8zX9uhgK3vLgDYgP5Z_Y_wuz0uj3FgE7lI55tGB4UVJuyW8S0R0Dx77UV_ue5Gr-RkXcGB5-eV7okJqX5TujUp5Jur-vN5-JWrJanga-jwIE";

  const memberId = await req.nextUrl.searchParams.get("memberId");
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
    console.log(response)
    return Response.json({ data: response.data, status: 200 });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return Response.json({ data: error, status: 500 });
  }
}
