#!/bin/bash
# ダブルクリックでプレビュー起動 (終了は Ctrl+C かウィンドウを閉じる)
cd "$(dirname "$0")"
PORT=8765
( sleep 1 && open "http://localhost:$PORT/" ) &
echo "3D名刺プレビュー: http://localhost:$PORT/"
echo "  日本:        http://localhost:$PORT/jp.html"
echo "  中国:        http://localhost:$PORT/cn.html"
echo "  スリランカ:  http://localhost:$PORT/lk.html"
echo "  モザンビーク: http://localhost:$PORT/mz.html"
echo "  コスタリカ:  http://localhost:$PORT/cr.html"
python3 -m http.server $PORT
