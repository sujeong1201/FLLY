import React, { useEffect } from "react";
import style from "./ListAdoptCheckModal.module.css";
import { ToastErrorMessage, ToastSuccessMessage } from "@/model/toastMessageJHM";
import { tokenHttp } from "@/api/tokenHttp";
import { useRouter } from "next/router";

interface Props {
  ModalChangeHandler: () => void;
  $selectId: number;
  UpdateAdptList: (fllyUpdateProgress: string) => void;
}

const ListAdoptCheckModal = ({ ModalChangeHandler, $selectId, UpdateAdptList }: Props) => {
  const router = useRouter();

  const NotClickEventHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    //상위 함수를 실행하지 말아라 (모달 꺼지는거 방지)
    e.stopPropagation();
  };

  const SummitBtnHandler = () => {
    tokenHttp
      .patch("/seller/flly/update/" + $selectId)
      .then((res) => {
        const rData = res.data;
        if (rData.code === 200) {
          ToastSuccessMessage(rData.message);
          UpdateAdptList(rData.data.fllyUpdateProgress);
          ModalChangeHandler();
        } else {
          ToastErrorMessage(rData.message);
          ModalChangeHandler();
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
  };

  return (
    <>
      <div className={style.checkBack} onClick={ModalChangeHandler}>
        <div className={style.modalBack} onClick={NotClickEventHandler}>
          <div>제작을 완료하시겠습니까?</div>
          <div>주문자에게 보여지는 상태가 변경됩니다.</div>
          <div className={style.modalBtnBox}>
            <div onClick={ModalChangeHandler}>취소</div>
            <div onClick={SummitBtnHandler}>확인</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListAdoptCheckModal;
