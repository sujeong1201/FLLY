import React, { useEffect, useState } from "react";
import style from "./ChatStart.module.css";
import { motion } from "framer-motion";
import { useQuery } from "react-query";
import { tokenHttp } from "@/api/tokenHttp";
import { useRecoilValue } from "recoil";
import { FllylistDiscRecoil } from "@/recoil/kdmRecoil";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { ToastErrorMessage } from "@/model/toastMessageJHM";

type CancelProps = {
  onCancel: () => void;
  shopInfo: storeContent;
};

const ChatStart = ({ onCancel, shopInfo }: CancelProps) => {
  const router = useRouter();
  const fllyRecoil = useRecoilValue(FllylistDiscRecoil);
  const { fllyId } = fllyRecoil;
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };
  const [title, setTitle] = useState<string>();
  const [sub, setSub] = useState<string>();

  const handleConfirm = () => {
    console.log("확인 버튼이 클릭되었습니다.");
    router.push({
      pathname: `/chatting/room/[id]`,
      query: {
        id: data?.chattingId,
      },
    });
    onCancel();
  };

  const { data, isError, isLoading } = useQuery<chatRoomBtn, AxiosError>(
    "ShopCardQuery",
    async () => {
      const res = await tokenHttp.post(`/chatting`, {
        sellerId: shopInfo.storeInfoDto.storeInfoId,
        fllyId: fllyId,
        fllyParticipationId: shopInfo.participant.fllyParticipationId,
      });
      console.log("생성", res.data.data);
      console.log("생성 방 ID", res.data.data.chattingId);

      return res.data.data;
    },
    {
      onError: (error) => {
        console.log("에러 발생했다 임마");
        console.log(error?.response?.status);
        if (error?.response?.status === 403) {
          router.push("/fllylogin");
        } else ToastErrorMessage("오류가 발생했습니다.");
      },
      onSuccess: () => {
        if (data?.isNew) {
          console.log("새거");
          setTitle(`${shopInfo.storeInfoDto.storeName}와 채팅이 생성되었습니다. `);
          setSub("해당 채팅방으로 이동하시겠습니까?");
        } else {
          console.log("기존");
          setTitle(`${shopInfo.storeInfoDto.storeName}와 채팅이 이미 존재합니다. `);
          setSub("해당 채팅방으로 이동하시겠습니까?");
        }
      },
      retry: false,
      cacheTime: 0,
    },
  );

  if (isError) {
    return <div>에러 발생</div>;
  }

  if (isLoading) {
    return (
      <motion.div className={style.checkBack} exit="exit" variants={modalVariants}>
        <motion.div
          className={style.modalBack}
          layout
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <div>요청중...</div>
          <div>잠시만 기다려주세요.</div>
          <div className={style.modalBtnBox}>
            <div onClick={onCancel}>취소</div>
            <div onClick={handleConfirm}>확인</div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div className={style.checkBack} exit="exit" variants={modalVariants}>
      <motion.div
        className={style.modalBack}
        layout
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
      >
        <div>{title}</div>
        <div>{sub}</div>
        <div className={style.modalBtnBox}>
          <div onClick={onCancel}>취소</div>
          <div onClick={handleConfirm}>확인</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatStart;
