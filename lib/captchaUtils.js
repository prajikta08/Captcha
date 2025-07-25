// lib/captchaUtils.js
export function newCaptchaImages() {
  const dogProbability = 0.5;
  return Array.from({ length: 9 }, () => {
    const isDog = Math.random() < dogProbability;
    const number = Math.floor(Math.random() * (isDog ? 10 : 13)) + 1;
    const filename = `${isDog ? "dog" : "muffin"}${number}.png`;
    return filename;
  });
}
