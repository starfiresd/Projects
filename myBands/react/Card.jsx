import React from "react";
import { Link } from "react-router-dom";

export default function Card(props) {
  const {
    CARD_IMAGE_SRC,
    CARD_IMAGE_ALT,
    CARD_TITLE,
    CARD_TEXT,
    LIST_GROUP_TITLE,
    LIST_GROUP_ITEM_1,
    LIST_GROUP_ITEM_2,
    LIST_GROUP_ITEM_3,
    CARD_LINK_TEXT_1,
    CARD_LINK_1,
    CARD_LINK_TEXT_2,
    CARD_LINK_2,
  } = props;

  const onMemberClicked = () => {
    props.onMemberClicked(1);
  };
  return (
    <>
      <div className="card card-style card-dim p-0 h-100 d-inline-block">
        <img
          src={CARD_IMAGE_SRC}
          className="card-img-top"
          alt={CARD_IMAGE_ALT}
        />
        <div className="card-body">
          <h5 className="card-title">{CARD_TITLE}</h5>
          <p className="card-text">{CARD_TEXT}</p>
        </div>
        <ul className="list-group list-group-flush list-group-style">
          <li className="list-group-item fw-bold">{LIST_GROUP_TITLE}</li>
          <li className="list-group-item">
            <Link onClick={onMemberClicked}>{LIST_GROUP_ITEM_1}</Link>
          </li>
          <li className="list-group-item">{LIST_GROUP_ITEM_2}</li>
          <li className="list-group-item">{LIST_GROUP_ITEM_3}</li>
        </ul>
        <div className="card-body">
          <a
            href={CARD_LINK_1}
            target="_blank"
            rel="noopener noreferrer"
            className="card-link"
          >
            {CARD_LINK_TEXT_1}
          </a>
          <a
            href={`mailto: ${CARD_LINK_2}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card-link"
          >
            {CARD_LINK_TEXT_2}
          </a>
        </div>
      </div>
    </>
  );
}
