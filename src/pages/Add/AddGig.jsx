import React from "react";
import { useSelector } from "react-redux";
import { CreateGig } from "../../components/AddGig/AddFirst";
const BASE_URL = process.env.REACT_APP_SERVER_URL;
import Budget from "../../components/AddGig/AddSecond";
import Gigdesc from "../../components/AddGig/AddThird";

function AddGig() {
  const gigState = useSelector((store) => store.gig);
  return (
    <>
      {/*gigState.step == 1 && <CreateGig />*/}
      {/*gigState.step == 2 && <Budget />*/}
      <Gigdesc />
    </>
  );
}

export default AddGig; ////chagne this code accordingly
