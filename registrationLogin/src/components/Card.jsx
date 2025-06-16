import React from "react";
import PropTypes from 'prop-types';

const Card = (props) => {
  return (
    <div
      className="inline-block mx-3 my-2 border-2 rounded-lg p-3 max-w-[350px] min-w-96 min-h-[550px] hover:scale-105 duration-200"
      key={props.id}
    >
      <img src={props.thumbnail} alt={props.title + " image"} className="rounded-xl" />
      <p className="text-2xl font-bold text-[#000]">{props.title}</p>
      <p className="text-[15px] text-[#000] mt-4">{props.description}</p>
    </div>
  );
};

Card.propTypes = {
  id: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Card;