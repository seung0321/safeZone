// src/controllers/mapController.js
import dotenv from 'dotenv';

dotenv.config();

// Kakao JS 앱 키 (JavaScript 키) - .env에 세팅해줘야 함
const { KAKAO_JS_APP_KEY } = process.env;

export const getMapView = (req, res) => {
  // RN에서 ?coords=... 로 넘겨줄 예정 (JSON 문자열)
  const { coords } = req.query;

  let coordinates = [];
  try {
    if (coords) {
      // RN 쪽에서 encodeURIComponent(JSON.stringify(...)) 했다면
      // Express가 자동으로 decode 해줘서 여기선 바로 JSON.parse 가능
      coordinates = JSON.parse(coords);
    }
  } catch (err) {
    console.error('Invalid coords query:', err);
    coordinates = [];
  }

  // Kakao JS 키 없으면 아예 에러 페이지 리턴
  if (!KAKAO_JS_APP_KEY) {
    return res
      .status(500)
      .send('<h1>KAKAO_JS_APP_KEY가 서버 .env에 설정되어 있지 않습니다.</h1>');
  }

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>SafeRoute Map</title>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      #map_div {
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="map_div"></div>

    <script>
      // 서버에서 받은 경로 좌표
      var routeCoordinates = ${JSON.stringify(coordinates)};

      // 디버깅용: 전역 에러를 RN으로 보내기
      window.onerror = function(message, source, lineno, colno, error) {
        try {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'MAP_ERROR',
              message: String(message),
              source: source,
              lineno: lineno,
              colno: colno,
              stack: error && error.stack ? error.stack : null,
              href: window.location.href
            }));
          }
        } catch (e) {}
        return false;
      };
    </script>

    <script
      type="text/javascript"
      src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_APP_KEY}&libraries=services,clusterer,drawing&autoload=false"
    ></script>

    <script>
      // kakao 객체 체크
      if (typeof kakao === 'undefined' || !kakao.maps) {
        try {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'MAP_ERROR',
              message: 'kakao 또는 kakao.maps가 정의되지 않았습니다.',
              href: window.location.href
            }));
          }
        } catch (e) {}
      } else {
        try {
          kakao.maps.load(function() {
            var mapContainer = document.getElementById('map_div');
            if (!mapContainer) {
              try {
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'MAP_ERROR',
                    message: 'map_div not found',
                    href: window.location.href
                  }));
                }
              } catch (e) {}
              return;
            }

            var userMarker = null;

            var mapOption = {
              center: new kakao.maps.LatLng(37.50802, 127.06283),
              level: 5
            };
            var map = new kakao.maps.Map(mapContainer, mapOption);

            // 경로 라인 그리기
            if (routeCoordinates && routeCoordinates.length > 0) {
              var linePath = routeCoordinates.map(function(c) {
                return new kakao.maps.LatLng(c[1], c[0]);
              });

              var bounds = new kakao.maps.LatLngBounds();
              linePath.forEach(function(latlng) { bounds.extend(latlng); });

              var polyline = new kakao.maps.Polyline({
                path: linePath,
                strokeWeight: 6,
                strokeColor: '#6A89FF',
                strokeOpacity: 0.9,
                strokeStyle: 'solid'
              });
              polyline.setMap(map);

              var startMarker = new kakao.maps.Marker({ position: linePath[0] });
              var endMarker = new kakao.maps.Marker({ position: linePath[linePath.length - 1] });
              startMarker.setMap(map);
              endMarker.setMap(map);

              map.setBounds(bounds);
            }

            // RN → WebView: 위치 업데이트
            window.addEventListener('message', function(event) {
              try {
                var data = JSON.parse(event.data);
                if (data.type === 'USER_LOCATION') {
                  var userPosition = new kakao.maps.LatLng(
                    data.payload.latitude,
                    data.payload.longitude
                  );
                  if (!userMarker) {
                    userMarker = new kakao.maps.Marker({
                      position: userPosition,
                      image: new kakao.maps.MarkerImage(
                        'https://ssl.pstatic.net/static/maps/m/pin_rd.png',
                        new kakao.maps.Size(24, 24),
                        { offset: new kakao.maps.Point(12, 12) }
                      )
                    });
                    userMarker.setMap(map);
                  } else {
                    userMarker.setPosition(userPosition);
                  }
                }
              } catch (e) {
                // 위치 업데이트 중 에러는 무시
              }
            });

            // WebView 준비 완료 신호
            try {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'webview_ready'
                }));
              }
            } catch (e) {}
          });
        } catch (e) {
          try {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'MAP_ERROR',
                message: 'kakao.maps.load 실행 중 에러: ' + String(e),
                stack: e && e.stack ? e.stack : null,
                href: window.location.href
              }));
            }
          } catch (err) {}
        }
      }
    </script>
  </body>
  </html>
  `;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.send(html);
};