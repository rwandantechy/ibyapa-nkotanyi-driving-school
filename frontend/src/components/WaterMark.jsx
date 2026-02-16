/* eslint-disable react/prop-types */
const WaterMark = ({ props }) => {
  return (
    <>
      {props.canvasLayer.children}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          left: 0,
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      >
        <div
          style={{
            color: "rgba(128, 128, 128, 0.1)",
            fontSize: `${3 * props.scale}rem`,
            fontWeight: "bold",
            textTransform: "uppercase",
            transform: "rotate(-45deg)",
            userSelect: "none",
            textAlign: "right",
          }}
        >
          NKOTANYI DRIVING SCHOOL
        </div>
      </div>
      {props.annotationLayer.children}
      {props.textLayer.children}
    </>
  );
};

export default WaterMark;
