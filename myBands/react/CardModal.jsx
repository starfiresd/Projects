import React, { useState } from "react";
import { Modal } from "react-bootstrap";

export default function CardModal(props) {
  const { show, artist } = props;

  console.log(artist);

  const handleClose = () => {
    props.handleClose();
  };

  return (
    <>
      <Modal show={show}>
        <Modal.Header className="modal-style text-white">
          <Modal.Title>
            <div className="container d-inline-block float-left">
              <img
                src="https://wallpaperaccess.com/full/3023972.jpg"
                width="50"
                height="44.44"
                alt="logo"
                className=""
              />
              Artist
            </div>
          </Modal.Title>
          <button
            type="button"
            className="btn-close btn-close-white float-right me-2"
            aria-label="Close"
            onClick={handleClose}
          ></button>
        </Modal.Header>
        <Modal.Body className="modal-style text-white">
          <div className="card card-style card-dim p-0 h-100 d-inline-block">
            <img
              src={artist.image}
              className="card-img-top"
              alt="profile_img"
            />
            <div className="card-body">
              <h5 className="card-title">
                {artist.firstName} {artist.lastName}
              </h5>
              <p className="card-text">{artist.username}</p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
