import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/main/Main.css";
import {
  getTourPlacesByCat1Array,
  getTourPlacesByCategory,
  getCategoryFromCat1,
} from "../../api/tourApi.js";

import Header from "../common/Header";
import Footer from "../common/Footer.jsx";
import BudgetSlider from "../main/BudgetSlider";
import HorizontalSlider from "../main/Slider";
import WeekView from "../main/WeekView";
import DateRange from "../main/DateRangePicker";

import PlaceDetailView from "../search/PlaceDetailView";

import { ReactComponent as BriefcaseIcon } from "../../images/main/briefcase.svg";
import jejuOceanImg from "../../images/main/jejuocean.png";
import PlaneIslandImg from "../../images/main/fifth/airplane.svg";
import Mandarin from "../../images/main/fifth/mandarin.svg";

import { ReactComponent as BedIcon } from "../../images/main//fifth/accommodation.svg";
import { ReactComponent as FoodIcon } from "../../images/main/fifth/restaurant.svg";
import { ReactComponent as CafeIcon } from "../../images/main/fifth/cafe.svg";
import { ReactComponent as ActivityIcon } from "../../images/main/fifth/activity.svg";
import { ReactComponent as HoverBedIcon } from "../../images/main//fifth/hover_accommodation.svg";
import { ReactComponent as HoverFoodIcon } from "../../images/main/fifth/hover_restaurant.svg";
import { ReactComponent as HoverCafeIcon } from "../../images/main/fifth/hover_cafe.svg";
import { ReactComponent as HoverActivityIcon } from "../../images/main/fifth/hover_activity.svg";

import { ReactComponent as Calendar } from "../../images/main/second/calendar_.svg";
import { ReactComponent as People } from "../../images/main/second/people.svg";
import { ReactComponent as BasicCalendar } from "../../images/main/second/basic_calendar.svg";
import { ReactComponent as BasicPeople } from "../../images/main/second/basic_people.svg";
import { ReactComponent as PlanButton } from "../../images/main/second/planbutton.svg";
import { nav } from "framer-motion/client";

function Main() {
  const [budget, setBudget] = useState([100000, 300000]);
  const [tripDuration, setTripDuration] = useState(null);
  const [isDurationPickerVisible, setIsDurationPickerVisible] = useState(false);
  const durationOptions = [
    "당일치기",
    "1박 2일",
    "2박 3일",
    "3박 4일",
    "4박 5일 이상",
  ];

  const [personnel, setPersonnel] = useState(null); // 2 -> null
  const [isPersonnelPickerVisible, setPersonnelPickerVisible] = useState(false);
  const personnelOptions = [1, 2, 3, 4];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [editorPicksData, setEditorPicksData] = useState([]);
  const [recommendationsData, setRecommendationsData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  //장소누르는상태임 이거 -지인이 추가-
  const [selectedPlace, setSelectedPlace] = useState(null);

  const navigate = useNavigate();

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const formatPersonnelDisplay = (p) => {
    if (p >= 4) return "4명 이상";
    return `${p}명`;
  };

  const categories = [
    {
      icon: BedIcon,
      hoverIcon: HoverBedIcon,
      title: "숙소",
      desc: "취향 따라 고르는<br />제주 숙소",
    },
    {
      icon: FoodIcon,
      hoverIcon: HoverFoodIcon,
      title: "식당",
      desc: "숨겨있는 제주<br />맛집 발견",
    },
    {
      icon: CafeIcon,
      hoverIcon: HoverCafeIcon,
      title: "카페",
      desc: "테마별 제주<br />핫플 카페",
    },
    {
      icon: ActivityIcon,
      hoverIcon: HoverActivityIcon,
      title: "액티비티",
      desc: "제주에서만<br />다채로운 체험",
    },
  ];

  const contentTypeMap = {
    12: "관광지",
    14: "문화시설",
    15: "행사/공연/축제",
    25: "여행코스",
    28: "레포츠",
    32: "숙박",
    38: "쇼핑",
    39: "음식점",
  };

  useEffect(() => {
    // 추천 명소: 관광지 (A01, A02)
    const fetchRecommendations = async () => {
      const data = await getTourPlacesByCat1Array(["A01", "A02"]);

      const simple = data.slice(32, 40).map((item, idx) => {
        const { contenttypeid, cat1, tag } = item;

        return {
          id: idx,
          image: item.imageUrls?.[0],
          title: item.title,
          tags: [
            contentTypeMap[String(contenttypeid)] ||
              getCategoryFromCat1(cat1) ||
              "관광지",
            ...(tag?.split(",").map((t) => t.trim()) || []),
          ],
          ...item, // 마지막에 병합
        };
      });

      setRecommendationsData(simple);
    };

    fetchRecommendations();
  }, []);

  useEffect(() => {
    // 이달의 여행: 액티비티 (A03)
    const fetchEditorPicks = async () => {
      const data = await getTourPlacesByCategory("A03");

      const filtered = data.slice(0, 4).map((item, idx) => ({
        id: idx,
        image: item.imageUrls?.[0],
        title: item.title,
        type: contentTypeMap[item.contenttypeid],
      }));

      setEditorPicksData(filtered);
    };

    fetchEditorPicks();
  }, []);

  return (
    <>
      <Header />

      {/*첫번째 페이지*/}
      <div className="FirstMain">
        <div className="visual-section">
          <div className="jeju-banner">
            <div className="banner-circles">
              <div className="circle circle1"></div>
              <div className="circle circle2"></div>
            </div>
            <div className="banner-horizontal-line"></div>
            <div className="banner-text">
              <h1>
                머니웨이에서 만나보세요,
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;당신을 위한{" "}
                <span className="highlight">제주여행</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="main-content-bg">
          <div className="banner-card-fix">
            <div className="icon-wrapper">
              <BriefcaseIcon className="card-icon-img-fix" />
            </div>
            <div className="content-wrapper">
              <div className="card-title-fix">
                머니웨이에서 가장 특별한 제주도 여정을 경험할 수 있어요.
              </div>
              <div className="card-footer-fix">
                <span className="card-footer-main-text">
                  숙소, 액티비티부터 숨은 명소까지, 완벽하게 설계하는 나만의
                  일정!
                </span>
                <div className="card-footer-action-group">
                  <span className="card-footer-sub-text">
                    한정된 예산 안에서 빛나는 여행을 경험해 보세요.
                  </span>
                  <div className="arrow-line"></div>
                  <button className="card-btn-fix">플랜 구경하기</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*두번째 페이지*/}
      <div className="plan-form-wrapper">
        <div className="plan-form-left">
          <div className="plan-title-card">
            <h2>예산과 일정을 입력해주세요</h2>
          </div>

          <BudgetSlider budget={budget} setBudget={setBudget} />

          <div className="selector-container">
            <div
              className="selector-row"
              onClick={() =>
                setIsDurationPickerVisible(!isDurationPickerVisible)
              }
            >
              {tripDuration ? (
                <People className="icon" />
              ) : (
                <BasicPeople className="icon" />
              )}
              <span className={!tripDuration ? "placeholder" : ""}>
                {tripDuration || "여행 기간"}
              </span>
            </div>

            {isDurationPickerVisible && (
              <div className="selector-options">
                {durationOptions.map((option) => (
                  <div
                    key={option}
                    className={`selector-option-item ${
                      tripDuration === option ? "selected" : ""
                    }`}
                    onClick={() => {
                      setTripDuration(option);
                      setIsDurationPickerVisible(false);
                    }}
                  >
                    <People className="icon" />
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="selector-container">
            <div
              className="selector-row"
              onClick={() =>
                setPersonnelPickerVisible(!isPersonnelPickerVisible)
              }
            >
              {personnel ? (
                <People className="icon" />
              ) : (
                <BasicPeople className="icon" />
              )}
              <span className={!personnel ? "placeholder" : ""}>
                {personnel ? formatPersonnelDisplay(personnel) : "인원"}
              </span>
            </div>

            {isPersonnelPickerVisible && (
              <div className="selector-options">
                {personnelOptions.map((option) => (
                  <div
                    key={option}
                    className={`selector-option-item ${
                      personnel === option ? "selected" : ""
                    }`}
                    onClick={() => {
                      setPersonnel(option);
                      setPersonnelPickerVisible(false);
                    }}
                  >
                    <People className="icon" />
                    <span>{formatPersonnelDisplay(option)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="plan-submit">
            플랜 생성
            <PlanButton className="icon" />
          </button>
          <div className="plan-direct" onClick={() => navigate("/aiplan")}>
            직접 계획할래요
          </div>
        </div>

        <div className="plan-form-right">
          <div className="plan-image-box">
            <img
              src={jejuOceanImg}
              alt="JEJU a beautiful island"
              className="plan-image"
            />
            <div className="plan-image-title">
              <div>JEJU,</div>
              <div>a beautiful island</div>
              <span className="plan-title-bar"></span>
            </div>
          </div>
        </div>
      </div>

      {/*3번째 페이지*/}
      <div className="editor-pick">
        <section className="editor-section-container">
          <div className="editor-section-header">
            <p className="editor-section-subtitle">Editor's Pick</p>
            <h2 className="editor-section-title">이달의 여행 구경하기</h2>
          </div>
          <HorizontalSlider>
            <div className="editor-cards-list">
              {editorPicksData.map((item) => (
                <div key={item.id} className="editor-pick-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="card-image"
                  />
                  <div className="card-title">{item.title}</div>
                </div>
              ))}
            </div>
          </HorizontalSlider>
        </section>
      </div>

      {/*4번째 페이지*/}
      <div className="recommendation">
        <section className="recommendation-section-container">
          <div className="recommendation-section-header">
            <p className="recommendation-section-subtitle">MONEYWAY's Pick</p>
            <h2 className="recommendation-section-title">추천 명소</h2>
          </div>
          <HorizontalSlider>
            <div className="moneyway-cards-list">
              {recommendationsData.map((item) => (
                // 선택된 장소 저장하는 onclick 추가했음 -지인-
                <div
                  key={item.id}
                  className="recommendation-card"
                  onClick={() => setSelectedPlace(item)}
                >
                  <div className="image-wrapper">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="card-image"
                    />
                  </div>

                  <div className="info-wrapper">
                    <h4 className="title">{item.title}</h4>
                    <div className="tags-wrapper">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </HorizontalSlider>
        </section>
      </div>

      {/*5번째 페이지*/}
      <div className="landing-main-wrapper">
        <div className="landing-content">
          <h1 className="landing-title">저예산 제주 여행을 찾고 계신가요?</h1>
          <p className="landing-desc">
            돌담길, 귤밭, 바다 내음 가득한 골목까지.
            <br />
            제주다운 여행을 돈 걱정 없이 즐기고 싶다면?
            <br />
            머니웨이가 숨은 스팟과 감성 숙소까지 챙겨드립니다.
          </p>
          <div className="landing-bar-img-row">
            <div className="landing-bar" />
            <img src={Mandarin} alt="" className="landing-thumb" />
            <div className="landing-sub">
              당신만을 위한 제주, 지금 여기서 시작해요.
            </div>
          </div>

          <div className="landing-category-cards">
            {categories.map((cat, idx) => {
              const Icon = hoveredIndex === idx ? cat.hoverIcon : cat.icon;
              return (
                <div
                  className="landing-category-card"
                  key={cat.title}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() =>
                    navigate(
                      `/search?category=${encodeURIComponent(cat.title)}`
                    )
                  }
                >
                  <Icon className="category-icon" />
                  <div>
                    <div className="category-title">{cat.title}</div>
                    <div
                      className="category-desc"
                      dangerouslySetInnerHTML={{ __html: cat.desc }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="landing-visual-bg">
          <div className="landing-bg-circle circle1">
            <div className="landing-bg-circle circle2">
              <div className="landing-bg-circle circle3"></div>
            </div>
          </div>
          <img
            src={PlaneIslandImg}
            alt="비행기 일러스트"
            className="landing-plane-img"
          />
        </div>
      </div>

      {/*6번째 페이지 만드는중*/}
      <div className="page-container">
        <aside className="sidebar">
          <h1 className="main-title">나의 플랜</h1>

          <DateRange onDateChange={handleDateChange} />

          <BudgetSlider budget={budget} setBudget={setBudget} />

          <button className="edit-plan-button">플랜 수정하기</button>
        </aside>

        <main className="main-content">
          <WeekView selectedDate={startDate} />

          <div className="empty-plan-message">
            <p>아직 플랜이 없어요.</p>
            <p>머니웨이와 플랜을 만들어 보세요!</p>
          </div>
        </main>
      </div>

      <Footer />
      {selectedPlace && (
        <div
          className="place-detail-overlay"
          onClick={() => setSelectedPlace(null)}
        >
          <div
            className="place-detail-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <PlaceDetailView
              place={selectedPlace}
              onBack={() => setSelectedPlace(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Main;
