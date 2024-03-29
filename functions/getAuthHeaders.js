import cookie from "cookie";

export default (req) => {
  const cookies = req.cookies;

  return cookies.get("todox-session")
    ? {
        Cookie: `${cookie.serialize(
          "todox-session",
          cookies.get("todox-session").value
        )}`,
      }
    : null;
};
