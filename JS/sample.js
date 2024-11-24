mapboxgl.accessToken =
  "pk.eyJ1IjoibmFiZTE1MjUiLCJhIjoiY20zcmR2NWt2MDR0bjJqcTBjOXJydHMxZyJ9.qmMN5FHiHAzD1-wtTYDlVg";

let map;

map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-v9",
  zoom: 4,
  center: [139.82685266271312, 35.76929685553336],
});

const coordinatesPairs = [
  {
    points: [
      [139.6917, 35.6895], // 開始点（東京）
      [137.0, 36.5],       // 制御点（中央のカーブ位置を設定）
      [135.5086818146899, 34.689344644860924], // 終了点（大阪）
    ],
  },
  {
    points: [
      [139.6917, 35.6895], // 開始点（東京）
      [150.5, 40.5],       // 制御点（中央のカーブ位置を設定）
      [129.8758050078462, 32.75817082685645], // 終了点（長崎）
    ],
  },
  // 他の座標ペアを追加可能
];

// 曲線を生成する関数（制御点を指定）
function createCurveWithThreePoints(start, control, end, segments = 100) {
  const curve = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    // 二次ベジェ曲線を計算
    const x =
      (1 - t) * (1 - t) * start[0] +
      2 * (1 - t) * t * control[0] +
      t * t * end[0];
    const y =
      (1 - t) * (1 - t) * start[1] +
      2 * (1 - t) * t * control[1] +
      t * t * end[1];

    curve.push([x, y]);
  }
  return curve;
}

// 地図の読み込み完了時に実行
map.on("load", () => {
  // 曲線データを生成
  const curves = coordinatesPairs.map((pair) => {
    const [start, control, end] = pair.points; // 各点を抽出
    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: createCurveWithThreePoints(start, control, end),
      },
    };
  });

  // ソースの追加
  map.addSource("curves-source", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: curves,
    },
  });

  // レイヤーの追加
  map.addLayer({
    id: "curves-layer",
    type: "line",
    source: "curves-source",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#FF0000", // 色を統一（赤色）
      "line-width": 4, // 線の太さ
    },
  });
});