import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/sessionOptions"; // ✅ use correct path
import fs from "fs";
import path from "path";

function newCaptchaImages() {
  const dogProbability = 0.5;
  return Array.from({ length: 9 }, () => {
    const isDog = Math.random() < dogProbability;
    const number = Math.floor(Math.random() * (isDog ? 10 : 13)) + 1;
    const filename = `${isDog ? "dog" : "muffin"}${number}.png`;
    return filename; // just return filename now
  });
}

async function handler(req, res) {
  const { index } = req.query;

  if (!req.session.captchaImages) {
    req.session.captchaImages = newCaptchaImages();
    await req.session.save();
  }

  const filename = req.session.captchaImages[index];
  const imagePath = path.join(process.cwd(), "public/dogs-and-muffins", filename);

  try {
    const imageBuffer = fs.readFileSync(imagePath);
    res.setHeader("Content-Type", "image/png");
    res.send(imageBuffer);
  } catch (err) {
    res.status(500).send("Image not found");
  }
}

// ✅ This is the correct way to export the route
export default withIronSessionApiRoute(handler, sessionOptions);
