import { useOutletContext } from "react-router-dom";
export default function Activity() {
  const { profileData } = useOutletContext();
  return <div>Activity</div>;
}
