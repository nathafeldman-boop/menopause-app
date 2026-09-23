import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#a85a3f",
          borderRadius: 7,
          color: "#fff8f2",
          fontFamily: "Georgia, serif",
          fontSize: 20,
        }}
      >
        A
      </div>
    ),
    { ...size }
  );
}
