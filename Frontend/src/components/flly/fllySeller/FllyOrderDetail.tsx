import React, { useEffect, useRef, useState } from "react";
import style from "./style/FllyOrderDetail.module.css";
import Image from "next/image";
import RequestDetail from "./fllySellerDetailComponent/RequestDetail";
import ResponseDetail from "./fllySellerDetailComponent/ResponseDetail";
import { useParams } from "next/navigation";
import { ToastErrorMessage } from "@/model/toastMessageJHM";
import { useRouter } from "next/router";
import { backIn } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { tokenHttp } from "@/api/tokenHttp";
import { useRecoilValue } from "recoil";
import { MemberInfo, memberInfoState } from "@/recoil/memberInfoRecoil";

interface flowerInfoType {
  flowerName: string;
  meaning: string;
}

interface fllyReqeustDeatilType {
  fllyId: number;
  flower1: flowerInfoType | null;
  flower2: flowerInfoType | null;
  flower3: flowerInfoType | null;
  imageUrl: string;
  orderType: string;
  progress: string;
  requestAddress: string;
  requestContent: string;
  situation: string;
  target: string;
  budget: number;
  color1: string | null;
  color2: string | null;
  color3: string | null;
  deadline: string;
  consumer: string;
}

interface fllyResponeType {
  content: string;
  fllyParticipationId: number;
  requestImageUrl: string;
  requestPrice: number;
}

const FllyOrderDetail = () => {
  const [fllyRequestInfo, setFllyRequestInfo] = useState<fllyReqeustDeatilType>();
  const [fllyResponseInfo, setFllyResponseInfo] = useState<fllyResponeType>();
  const fllyId = useParams();
  const router = useRouter();
  const backImgRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [slideState, setSlideState] = useState({ activeSlide: 0, activeSlide2: 0 });
  const [slideImgSize, setSlideImgSize] = useState<number>(2);
  const [backWidth, setbackWidth] = useState<number>();
  const memberInfo = useRecoilValue<MemberInfo>(memberInfoState);

  const settings = {
    slide: "div",
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    cssEase: "linear",
    arrows: false,
    beforeChange: (current: number, next: number) =>
      setSlideState({ activeSlide: next, activeSlide2: current }),
  };

  useEffect(() => {
    if (backRef.current) {
      const backWidth = backRef.current.offsetWidth;
      setbackWidth(backWidth);
      if (backImgRef.current) {
        backImgRef.current.style.height = backWidth + "px";
      }
    }

    if (memberInfo.role === "SELLER") {
      tokenHttp
        .get("/seller/flly/request/" + fllyId.fllyId)
        .then((res) => {
          const rsData = res.data;
          if (rsData.code == 200) {
            // console.log(res.data.data);
            setFllyRequestInfo(rsData.data.fllyRequestDto);
            setFllyResponseInfo(rsData.data.fllyResponeDto);
          } else {
            ToastErrorMessage(rsData.message);
          }
          if (res.headers.authorization) {
            localStorage.setItem("accessToken", res.headers.authorization);
          }
        })
        .catch((err) => {
          if (err.response.status === 403) {
            router.push("/fllylogin");
          }
        });
    } else {
      tokenHttp
        .get("/seller/flly/request/buyer/" + fllyId.fllyId)
        .then((res) => {
          const rsData = res.data;
          if (rsData.code == 200) {
            setFllyRequestInfo(rsData.data.fllyRequestDto);
            setFllyResponseInfo(rsData.data.fllyResponeDto);
          } else {
            ToastErrorMessage(rsData.message);
          }
          if (res.headers.authorization) {
            localStorage.setItem("accessToken", res.headers.authorization);
          }
        })
        .catch((err) => {
          if (err.response.status === 403) {
            router.push("/fllylogin");
          }
        });
    }
    /* eslint-disable-next-line */
  }, []);

  return (
    <>
      <div className={style.detailBack} ref={backRef}>
        <div className={style.backBtn}>
          <Image
            src="/img/btn/left-btn.png"
            alt="뒤로가기"
            width={15}
            height={25}
            onClick={() => {
              router.back();
            }}
          />
        </div>
        <div className={style.detailHeader} ref={backImgRef}>
          <div className={style.headerCnt}>
            {slideState.activeSlide + 1} / {slideImgSize}
          </div>

          <Slider {...settings} className={style.sliderBox}>
            {fllyRequestInfo && (
              <>
                <div className={style.headerInfo}>의뢰 사진</div>
                <Image
                  src={fllyRequestInfo?.imageUrl}
                  alt="의뢰 사진"
                  width={backWidth}
                  height={backWidth}
                ></Image>
              </>
            )}
            {fllyResponseInfo && (
              <>
                <div className={style.headerInfo}>제안 사진</div>
                <Image
                  src={fllyResponseInfo?.requestImageUrl}
                  alt="제안 사진"
                  width={backWidth}
                  height={backWidth}
                ></Image>
              </>
            )}
          </Slider>
        </div>
        <div className={style.detailMain}>
          {fllyRequestInfo && <RequestDetail $fllyRequestInfo={fllyRequestInfo} />}
          {fllyResponseInfo && <ResponseDetail $fllyResponseInfo={fllyResponseInfo} />}
        </div>
      </div>
    </>
  );
};

export default FllyOrderDetail;
