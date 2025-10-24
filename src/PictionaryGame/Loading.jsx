import { useState } from "react";
import HashLoader from "react-spinners/HashLoader";

function Loading() {
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("white");

  return (
    <div className="sweet-loading">

      <HashLoader style={{marginTop: 500}}
        color={color} // Dynamic color
        loading={loading}
        cssOverride={override} // Apply styles correctly
        size={80}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Loading;
