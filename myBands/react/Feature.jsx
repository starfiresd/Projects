import React from "react";
import Slider from "../page/Slider";

export default function Feature(props) {
  const { IMAGES_FEATURE, IMAGE_HIGHLIGHT, VIDEO_HIGHLIGHT } = props;
  return (
    <>
      <div className="container container-feature image-fit-cover no-margin-padding">
        <div className="row row-cols-2 justify-content-center row-size-feature">
          <div className="col-8">
            <Slider images={IMAGES_FEATURE} />
          </div>
          <div className="col-4">
            <div className="row">
              <img src={IMAGE_HIGHLIGHT} alt="band-highlight" />
            </div>
            <div className="row">
              <iframe
                src={VIDEO_HIGHLIGHT}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
