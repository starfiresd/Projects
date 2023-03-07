import React, { useEffect, useState } from "react";
import Feature from "../page/Feature";
import { IMAGES_BANDS, VIDEOS_HIGHLIGHTS } from "../../images/images";
import Card from "../page/Card";
import { getAll } from "../../services/bandsService";
import { getArtistById } from "../../services/usersService";
import { Modal } from "react-bootstrap";
import CardModal from "../page/CardModal";

var incrementor = 0;

const defaultBands = {
  bands: [],
  bandsComponents: [],
};

const defaultArtist = {
  id: 0,
  firstName: "",
  lastName: "",
  username: "",
  image: "",
};

export default function Bands() {
  const [bands, setBands] = useState(defaultBands);
  const [modal, setModal] = useState(false);
  const [artist, setArtist] = useState(defaultArtist);

  const getMappedComponents = (convertedItems) => {
    const mapItemComponent = (item) => {
      return (
        <Card
          key={`card-${incrementor++}`}
          CARD_IMAGE_SRC={item.images[0].url}
          CARD_IMAGE_ALT="logo"
          CARD_TITLE={item.name}
          CARD_TEXT={item.slug}
          LIST_GROUP_TITLE="Members"
          LIST_GROUP_ITEM_1={item.members[0].firstName}
          LIST_GROUP_ITEM_2={item.members[1].firstName}
          LIST_GROUP_ITEM_3={item.members[2].firstName}
          CARD_LINK_TEXT_1="Website"
          CARD_LINK_1="www.google.com"
          CARD_LINK_TEXT_2="Email"
          CARD_LINK_2="test@gmail.com"
          onMemberClicked={onMember}
        />
      );
    };
    return convertedItems.map(mapItemComponent);
  };

  useEffect(() => {
    getAll().then(onGetAllSuccess).catch(onGetAllError);
  }, []);

  const onGetAllSuccess = (response) => {
    setBands((prevState) => {
      const newBands = { ...prevState };
      newBands.bands = response.data.items;
      newBands.bandsComponents = getMappedComponents(newBands.bands);
      return newBands;
    });
  };

  const onGetAllError = (response) => {
    console.error(response);
  };

  const handleClose = () => {
    setModal(false);
  };

  const onMember = (id) => {
    getArtistById(id).then(onGetArtistSuccess).catch(onGetArtistError);
  };

  const onGetArtistSuccess = (response) => {
    setArtist((prevState) => {
      const newArtist = { ...prevState };
      newArtist.id = response.data.item.id;
      newArtist.firstName = response.data.item.firstName;
      newArtist.lastName = response.data.item.lastName;
      newArtist.username = response.data.item.username;
      newArtist.image = response.data.item.images[0].url;
      return newArtist;
    });
    setModal(true);
  };

  const onGetArtistError = (response) => {
    console.error(response);
  };

  return (
    <>
      <CardModal show={modal} handleClose={handleClose} artist={artist} />
      <div className="container">
        <div className="row">
          <Feature
            IMAGES_FEATURE={IMAGES_BANDS}
            IMAGE_HIGHLIGHT={IMAGES_BANDS[5].image}
            VIDEO_HIGHLIGHT={VIDEOS_HIGHLIGHTS[0].video}
          />
        </div>
      </div>
      <div className="container">
        <div className="row">{bands.bandsComponents}</div>
      </div>
    </>
  );
}
