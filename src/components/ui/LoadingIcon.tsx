import React from "react";

// Colors sampled directly from the source image
const FRAME_BLUE = "#00BCFB";
const DOT_GRAY = "#9198A8";
const BG_BLACK = "#000000";

// Outer rounded-square outline, traced from the image (evenodd combined with
// innerPath below to create the frame cutout)
const outerPath =
  "M1058,227 L1042,211 L1019,194 L1000,184 L979,176 L952,169 L922,165 L864,165 " +
  "L492,212 L404,225 L356,240 L331,252 L304,268 L277,289 L246,323 L224,357 " +
  "L215,376 L204,407 L196,449 L155,840 L156,890 L162,919 L169,939 L179,959 " +
  "L193,979 L213,999 L229,1011 L255,1025 L282,1035 L331,1044 L394,1044 " +
  "L605,1019 L627,1015 L811,993 L847,987 L888,975 L917,962 L947,944 L972,925 " +
  "L991,906 L1009,884 L1026,858 L1035,840 L1049,802 L1055,775 L1097,370 " +
  "L1097,325 L1091,290 L1079,259 L1070,243 Z";

// Inner cutout (the "hole" in the frame), traced from the image
const innerPath =
  "M894,358 L905,380 L907,388 L908,407 L904,433 L904,443 L902,451 L899,489 " +
  "L888,588 L886,596 L872,730 L868,751 L859,771 L852,782 L834,800 L814,812 " +
  "L795,818 L423,864 L411,864 L392,861 L371,850 L361,840 L356,833 L352,823 " +
  "L349,810 L348,791 L363,641 L367,614 L367,603 L381,464 L386,443 L394,426 " +
  "L401,416 L415,402 L437,388 L465,380 L726,349 L830,335 L850,335 L868,339 " +
  "L884,348 Z";

// Dot: resting center (624.5, 606), radius 69.5, traveling down to ~769.5
// so its edge touches the inner surface, then returning to its original spot
export default function LoadingLogo() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        background: BG_BLACK,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg viewBox="0 0 1254 1254" width={300} height={300}>
        <rect x="0" y="0" width="1254" height="1254" fill={BG_BLACK} />

        {/* Blue frame with the inner square cut out, exact traced shape */}
        <path d={`${outerPath} ${innerPath}`} fill={FRAME_BLUE} fillRule="evenodd" />

        {/* Loading dot: moves down, touches the inner surface, comes back */}
        <circle cx="624.5" cy="606" r="69.5" fill={DOT_GRAY}>
          <animate
            attributeName="cy"
            values="606;769.5;606"
            keyTimes="0;0.5;1"
            dur="1.3s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          />
        </circle>
      </svg>
    </div>
  );
}