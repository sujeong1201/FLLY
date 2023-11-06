import { useState, useEffect } from "react";
import style from "./OrderModal.module.css";
import Image from "next/image";
import axios from "axios";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker, TimeField, LocalizationProvider } from "@mui/x-date-pickers";
import { ThemeProvider, createTheme } from "@mui/material";
import { Dayjs } from "dayjs";
import "dayjs/locale/ko";

type PcikupOrderProps = {
  chattingId: number;
  modalHandler: Function;
  sendHandler: Function;
};

const PickupOrderModal: React.FC<PcikupOrderProps> = ({
  chattingId,
  modalHandler,
  sendHandler,
}) => {
  const [orderInputs, setOrderInputs] = useState({
    orderType: "PICKUP",
    ordererName: "",
    phoneNumber: "",
    deliveryPickupTime: "",
    requestContent: "",
  });
  const [date, setDate] = useState<Dayjs | null>(null);
  const [time, setTime] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (orderInputs.phoneNumber.length === 10) {
      setOrderInputs((prev) => {
        return {
          ...prev,
          phoneNumber: prev.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
        };
      });
    }
    if (orderInputs.phoneNumber.length === 13) {
      setOrderInputs((prev) => {
        return {
          ...prev,
          phoneNumber: prev.phoneNumber
            .replace(/-/g, "")
            .replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"),
        };
      });
    }
  }, [orderInputs.phoneNumber]);

  const saveRequest = () => {
    // console.log("saveRequest");
    // console.log(orderInputs);
    if (date && time) {
      setOrderInputs((prev) => {
        const updatedInputs = {
          ...prev,
          deliveryPickupTime: date.format("YYYY-MM-DD") + " " + time.format("HH:mm"),
        };

        axios
          .post(`https://flower-ly.co.kr/api/chatting/request/${chattingId}`, updatedInputs)
          .then((response) => {
            console.log(response.data);
            if (response.data.code == "200") sendHandler();
            else if (response.data.code == "-604") alert("이미 진행중인 주문이 있습니다.");
          })
          .catch((error) => console.log(error));

        return updatedInputs;
      });
    } else {
      alert("날짜, 시간을 입력하세요.");
    }
  };

  const theme = createTheme({
    components: {
      MuiInputBase: {
        styleOverrides: {
          root: {
            boxSizing: "border-box",
            fontFamily: "NanumSquareNeoOTF-Lt",
            fontSize: "14px",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            boxSizing: "border-box",
            borderRadius: "5px",
            marginRight: "5px",
          },
          input: {
            padding: "5px 10px",
          },
          notchedOutline: {
            border: "1px solid var(--moregray)",
          },
        },
      },
    },
  });

  return (
    <>
      <div className={style.modalBg}>
        <div className={style.modalMain}>
          <div className={style.top}>
            <div className={style.title}>픽업 주문서 작성</div>
            <div
              className={style.closeBtn}
              onClick={() => {
                modalHandler("PICKUP", false);
              }}
            >
              <Image
                className={style.icon}
                src="/img/icon/close.png"
                width={17}
                height={17}
                alt="닫기 버튼"
              />
            </div>
          </div>
          <div className={style.middle}>
            <div className={style.subTitle}>주문 정보</div>
            <div className={style.content}>
              <div className={style.contentItem}>
                <div className={style.itemTitle}>주문자</div>
                <input
                  className={style.input}
                  id={style.nameInput}
                  value={orderInputs.ordererName}
                  onChange={(e) => {
                    setOrderInputs((prev) => {
                      return { ...prev, ordererName: e.target.value };
                    });
                  }}
                />
              </div>
              <div className={style.contentItem}>
                <div className={style.itemTitle}>연락처</div>
                <input
                  className={style.input}
                  id={style.nameInput}
                  type="text"
                  value={orderInputs.phoneNumber}
                  onChange={(e) => {
                    const regex = /^[0-9\b -]{0,13}$/;
                    if (regex.test(e.target.value)) {
                      setOrderInputs((prev) => {
                        return { ...prev, phoneNumber: e.target.value };
                      });
                    }
                  }}
                />
              </div>
              <div className={style.contentItem}>
                <div className={style.itemTitle}>픽업일시</div>
                {/* <div
                  className={style.input}
                  id={style.dateInput}
                  onClick={() => dateClickHandler()}
                >
                  <Image
                    className={style.icon}
                    src="/img/icon/calendar.png"
                    width={18}
                    height={18}
                    alt="상태이미지"
                  />
                </div> */}
                <ThemeProvider theme={theme}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                    <MobileDatePicker
                      format="YYYY-MM-DD"
                      className={style.datePicker}
                      sx={{
                        width: "130px",
                      }}
                      value={date}
                      onChange={setDate}
                    />
                    <TimeField
                      format="HH:mm"
                      className={style.timePicker}
                      value={time}
                      onChange={setTime}
                    />
                  </LocalizationProvider>
                </ThemeProvider>
              </div>
              <div className={style.contentItem} id={style.commentDiv}>
                <div className={style.itemTitle}>요청사항</div>
                <textarea
                  className={style.input}
                  id={style.commentArea}
                  value={orderInputs.requestContent}
                  onChange={(e) => {
                    setOrderInputs((prev) => {
                      return { ...prev, requestContent: e.target.value };
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className={style.bottom}>
            <button
              className={style.btn}
              onClick={() => {
                saveRequest();
                modalHandler("PICKUP", false);
              }}
            >
              전송하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PickupOrderModal;
