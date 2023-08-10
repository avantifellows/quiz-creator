import React from "react";
import PropTypes from "prop-types";

export default function Button({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  const handleClick = () => {
    onClick();
  };

  return <button onClick={handleClick}>{text}</button>;
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
