import React, { useEffect, useState } from "react";
import _ from "lodash";
import { getProductPageCard } from "../../../../../utils/Services";
import parse from "html-react-parser";
import CardSkelton from "../../../../../skeleton/productSkeleton/CardSkelton";

const AppOffer = () => {
  const [loading, setLoading] = useState(true);
  const [cardRespose, setCardRespose] = useState([]);
  useEffect(() => {
    cardContent();
  }, []);

  const cardContent = async () => {
    const response = await getProductPageCard("card_one");

    if (!_.isEmpty(response)) {
      setCardRespose(response);
    }
    setLoading(false);
  };

  const content = `${cardRespose?.content}`;

  if (loading) return <CardSkelton />;

  return (
    <div
      className='cardHighlight saleChinaOff mb05'
      style={{
        borderRadius: "8px",
        padding: "0.75rem 1rem",
      }}
    >
      <div className='app-in'>{parse(content)}</div>
    </div>
  );
};

export default AppOffer;
