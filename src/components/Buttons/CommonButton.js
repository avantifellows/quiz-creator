import React from "react";
import PropTypes from "prop-types";

export default function CommonButton({ text, onClick }) {
  const handleClick = () => {
    onClick();
  };

  return <button onClick={handleClick}>{text}</button>;
}

CommonButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
