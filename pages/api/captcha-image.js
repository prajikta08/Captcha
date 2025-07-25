import * as fs from 'fs';
import { withIronSessionApiRoute } from "iron-session/next";
import * as path from "path";

const dogProbability = 0.5;
export function newCaptchaImages() {
  return (new Array(9))
    .fill(null)
    .map(() => {
      const shouldBeDog = Math.random() < dogProbability;
      const number = Math.floor(Math.random() * (shouldBeDog ? 10 : 13)) + 1;
      const filename = (shouldBeDog ? 'dog' : 'muffin') + number + '.png';
      return filename; 
    });
}

export default withIronSessionApiRoute(async function handler(req, res) {
  const index = req.query.index;
  if (!req.session.captchaImages) {
    req.session.captchaImages = newCaptchaImages();
    await req.session.save();
  }

  const filename = req.session.captchaImages[index];
  const imagePath = path.join(process.cwd(), 'public/dogs-and-muffins', filename); 
  const imageBuffer = fs.readFileSync(imagePath); 

  res.setHeader('Content-Type', 'image/png');
  res.send(imageBuffer);
}, {
  cookieName: 'session',
  password: process.env.SESSION_SECRET,
   cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
