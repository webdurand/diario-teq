import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/seo";

export const alt = "DiárioTeq - blog sobre engenharia de software";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "#0f172a",
          color: "#f8fafc",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            opacity: 0.9,
          }}
        >
          DiárioTeq
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              fontWeight: 700,
            }}
          >
            Engenharia de software
            <br />
            em formato diário
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#cbd5e1",
            }}
          >
            {siteConfig.description}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
