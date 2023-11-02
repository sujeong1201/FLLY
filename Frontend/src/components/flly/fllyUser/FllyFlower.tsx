import React from "react";
import style from "./FllyFlower.module.css";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { useRecoilState } from "recoil";
import { situationState } from "@/recoil/fllyRecoil";
import { targetState } from "@/recoil/fllyRecoil";
import { colorState } from "@/recoil/fllyRecoil";
import { flowerState } from "@/recoil/fllyRecoil";
import { flowerCardType } from "@/recoil/fllyRecoil";
import Image from "next/image";

const FllyFlower = () => {
  const situation = useRecoilValue(situationState);
  const target = useRecoilValue(targetState);
  const colors = useRecoilValue(colorState);
  const [flowers, setFlowers] = useRecoilState(flowerState);
  const [selected, setSelected] = useState<flowerCardType[]>([]);
  const flowerList = [] as flowerCardType[];

  const handleSelect = (e:flowerCardType) => {
    if(selected.includes(e)) {
      subValue(e);
    } else if(selected.length < 3) {
      addValue(e);
    }
  };

  const subValue = (value:flowerCardType) => {
    const updatedSelect = selected.filter(item => item !== value);
    setSelected(updatedSelect);
    setFlowers(updatedSelect);
  }

  const addValue = (newValue:flowerCardType) => {
    const updatedSelected = [...selected, newValue];
    setSelected(updatedSelected);
    setFlowers(updatedSelected);
  };

  return (
    <>
      <div className={style.fllyBox}>
        <div className={style.contentBox}>
          <div className={style.headerTitle}>
            <div className={style.guide}>원하는 꽃을 선택해주세요.</div>
            <div className={style.guidePlus}>최대 3개까지 선택 가능합니다.</div>
          </div>
          <div className={style.selectAreaBox}>
            {flowerList.length === 0? <div className={style.selectLoading}>꽃 목록을 로딩중입니다.</div> : 
              <div className={style.selectBox}>
              {flowerList.map((item, index) => (
                <div key={index} className={style.selectCard} onClick={() => {handleSelect(item)}}>
                  <div className={selected.includes(item)?`${style.selectImg} ${style.selectedImg}` : style.selectImg} style={{ backgroundImage: `url(${item.img_url})` }}>
                    {selected.includes(item) && <Image src="/img/icon/check.png" width={60} height={45} alt="체크"></Image>}
                  </div>
                  <div className={style.selectWord}>
                    <div className={style.flowerName}>{item.flower_name}</div>
                    <div className={style.flowerMeaning}>{item.flower_meaning}</div>
                  </div>
                </div>
              ))}
                <div className={style.selectCard}>
                  <div className={`${style.selectImg} ${style.selectedImg}`} style={{ backgroundImage: "url(/img/homeBanner/121_pink_gomphrena.jpg)" }}>
                    <Image src="/img/icon/check.png" width={60} height={45} alt="체크"></Image>
                  </div>
                  <div className={style.selectWord}>
                    <div className={style.flowerName}>알스트로메리아</div>
                    <div className={style.flowerMeaning}>사랑, 부드러운 감정</div>
                  </div>
                </div>
                <div className={style.selectCard}>
                  <div className={style.selectImg} style={{ backgroundImage: "url(/img/homeBanner/141_purple_gladiolus.jpg)" }}></div>
                  <div className={style.selectWord}>
                    <div className={style.flowerName}>글라디올러스</div>
                    <div className={style.flowerMeaning}>우아함, 아름다움</div>
                  </div>
                </div>
                <div className={style.selectCard}></div>
                <div className={style.selectCard}></div>
                <div className={style.selectCard}></div>
                <div className={style.selectCard}></div>
              </div>
            }
          </div>
          <div className={style.btnBox}>
            <div className={style.prevBtn}>&lt;</div>
            <div className={style.nextBtn}>다음</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FllyFlower;