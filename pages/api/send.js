import {withIronSessionApiRoute} from "iron-session/next";
import { newCaptchaImages } from "../../lib/captchaUtils";

export default withIronSessionApiRoute(async function handler(req,res) {
  const {message,selectedIndexes} = req.body;
  const dogsIndexes = req.session.captchaImages
  .map((filename, index) => filename.startsWith('dog') ? index : -1)

    .filter(index => index !== -1);


  const captchaIsOk = JSON.stringify(dogsIndexes) === JSON.stringify(selectedIndexes.sort());


  // reset captcha images
  req.session.captchaImages = newCaptchaImages();
  await req.session.save();


  // send
  const sent = captchaIsOk;
  // send for real

  res.json({
    captchaIsOk,
    sent,
  });
}, {
  cookieName: 'session',
  password: process.env.SESSION_SECRET,
});