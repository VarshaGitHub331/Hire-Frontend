import React from "react";
import { useSelector } from "react-redux";
import { CreateGig } from "../../components/AddGig/AddFirst";
const BASE_URL = process.env.REACT_APP_SERVER_URL;
import Budget from "../../components/AddGig/AddSecond";
import Gigdesc from "../../components/AddGig/AddThird";
import HorizontalProgressBar from "../../components/progress/Progress";
function AddGig() {
  const gigState = useSelector((store) => store.gig);
  return (
    <>
      <HorizontalProgressBar />

      {gigState.step == 1 && <CreateGig />}
      {gigState.step == 2 && <Budget />}
      {gigState.step == 3 && <Gigdesc />}
    </>
  );
}

export default AddGig; ////chagne this code accordingly
