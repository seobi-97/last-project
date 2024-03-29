import React, { useEffect } from "react";
const { kakao } = window;

const MapContainer = ({ searchPlace, placedata, getData }) => {
  useEffect(() => {
    let container = document.getElementById("map");
    let options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    let infowindow = new kakao.maps.InfoWindow({
      zIndex: 1,
    });
    let map = new kakao.maps.Map(container, options);

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(searchPlace, placeSearchCB);

    function placeSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds();
        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        map.setBounds(bounds);
      }
    }
    //지도에 마커를 표시하는 함수
    function displayMarker(place) {
      //마커를 생성하고 지도에 표시
      let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });
      //마커에 클릭이벤트를 등록
      kakao.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(
          '<div style="padding:5px;font-size:12px;">' +
            place.place_name +
            "</div>"
        );
        infowindow.open(map, marker);
        getData(place.place_name);
      });
    }

    console.log("loading kakaomap");
  }, [searchPlace]);
  return (
    <div
      id="map"
      style={{ marginTop: "20px", width: "400px", height: "400px" }}
    ></div>
  );
};
export default MapContainer;
