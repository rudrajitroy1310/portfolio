// Portrait tablets (iPad jaisi) ko bhi MobileApp milta hai (useDeviceMode
// sirf aspect-ratio dekhta hai). Phone design 480px width ke liye bana hai,
// isliye tablet par usse CSS `zoom` se poori screen width tak scale karte
// hain (index.css: "Mobile shell on portrait tablets").
//
// Zoom ke andar raw vw/vh/dvh units bhi zoom se multiply ho jaate hain
// (1vw ka matlab 1vw * zoom ban jaata hai), isliye mobile CSS mein raw vw/vh
// ki jagah --mvw / --mvh / --mvsh / --mvdh use hote hain. Yahan wo variables
// tablet ke liye sahi px value pe set hote hain. Phone (<=480px) pe kuch set
// nahi hota — CSS ke default (1vw, 1vh...) hi chalte hain, matlab phone pe
// koi change nahi.

const BASE_WIDTH = 480;
const VARS = ['--tablet-zoom', '--mvh', '--mvsh', '--mvdh'];

export function applyTabletScale() {
  const root = document.documentElement;
  const w = window.innerWidth;
  const h = window.innerHeight;

  if (w > BASE_WIDTH && w < h) {
    const zoom = w / BASE_WIDTH;
    // 1 "zoomed vh" = (h / 100) real px, aur zoom usse dobara multiply karega,
    // isliye yahan zoom se divide karte hain.
    const unit = `${h / 100 / zoom}px`;
    root.style.setProperty('--tablet-zoom', String(zoom));
    root.style.setProperty('--mvh', unit);
    root.style.setProperty('--mvsh', unit);
    root.style.setProperty('--mvdh', unit);
  } else {
    VARS.forEach((v) => root.style.removeProperty(v));
  }
}

export function initTabletScale() {
  applyTabletScale();
  window.addEventListener('resize', applyTabletScale);
  window.addEventListener('orientationchange', applyTabletScale);
}
