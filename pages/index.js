import { getIronSession } from "iron-session";
import { sessionOptions } from "../lib/sessionOptions";
import { newCaptchaImages } from "./api/captcha-image";
import Captcha from "../components/Captcha";
import { useState } from "react";

export default function Home({ defaultCaptchaKey }) {
  const [message, setMessage] = useState("");
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [captchaKey, setCaptchaKey] = useState(defaultCaptchaKey);

  function send() {
    if (!message) {
      alert("The message is required");
      return;
    }

    fetch("/api/send", {
      method: "POST",
      body: JSON.stringify({
        message,
        selectedIndexes,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      response.json().then((json) => {
        if (json.sent) {
          setCaptchaKey(Date.now());
          alert("message sent");
          setMessage("");
        }
        if (!json.captchaIsOk) {
          setCaptchaKey(Date.now());
          alert("wrong captcha. try again");
        }
      });
    });
  }

  return (
    <main>
      <input
        type="text"
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
        value={message}
      />
      <div>
        <Captcha captchaKey={captchaKey} onChange={setSelectedIndexes} />
      </div>
      <button onClick={send}>Send</button>
    </main>
  );
}

// ✅ Correctly using getIronSession here
export async function getServerSideProps({ req, res }) {
  const session = await getIronSession(req, res, sessionOptions);

  if (!session.captchaImages) {
    session.captchaImages = newCaptchaImages();
    await session.save();
  }

  return {
    props: {
      defaultCaptchaKey: Date.now(),
    },
  };
}
