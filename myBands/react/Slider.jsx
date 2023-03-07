import React, { useEffect, useState } from "react";
import "../../App.css";

const delay = 20000;

function Slider({ images }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setTimeout(
      () =>
        setCurrent((prevState) =>
          prevState === images.length - 1 ? 0 : prevState + 1
        ),
      delay
    );
    return () => {};
  }, [current]);

  return (
    <section className="slider">
      {images.map((image, index) => {
        return (
          <div
            className={index === current ? "slide active" : "slide"}
            key={index}
          >
            {index === current && <img src={image.image} alt="images" />}
          </div>
        );
      })}
    </section>
  );
}

export default Slider;
