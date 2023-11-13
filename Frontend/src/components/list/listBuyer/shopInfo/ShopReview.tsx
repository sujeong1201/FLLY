import React, { useEffect, useState } from "react";
import style from "./ShopReview.module.css";

type ShopReviewProps = {
  review: reviewlist[];
};

const ShopReview = ({ review }: ShopReviewProps) => {
  return (
    <div className={style.reviewMain}>
      <div className={style.reviewTitle}>사용자 리뷰</div>
      {review.length > 0 ? (
        review.map((review, idx) => {
          const splitT = review.createdAt.split("T");
          const date = splitT[0];
          console.log(date);

          return (
            <div className={style.review} key={review.createdAt + idx}>
              <div className={style.reviewUser}>
                <div className={style.userName}>{review.consumerNickName}</div>
                <div className={style.reviewTime}>{date}</div>
              </div>
              <div className={style.reviewContent}>{review.content}</div>
            </div>
          );
        })
      ) : (
        <div>텅</div>
      )}
    </div>
  );
};

export default ShopReview;
