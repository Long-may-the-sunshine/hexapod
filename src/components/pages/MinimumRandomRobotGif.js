import React from "react"

const getImageUrl = () =>
    Math.random() > 0.5 ? "./img/small-robot-small.gif" : "./img/small-robot-2-small.gif"

const MinimumRandomRobotGif = () => (
    <img
        src={getImageUrl()}
        height="75px"
        alt="hexapod robot animation"
        style={{ marginTop: "10px", borderRadius: "20px" }}
    />
)

export default MinimumRandomRobotGif
