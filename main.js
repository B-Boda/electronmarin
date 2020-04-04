"use strict";

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const fs = require("fs");
let mainWindow;
var boundsFile = path.join(__dirname, 'bounds_info.json');

//-> 保存しておいたウィンドウサイズの取得
var bounds = null;
try {
  bounds = JSON.parse(
    fs.readFileSync(boundsFile, 'utf8')
  );
}
catch (e) {
  bounds = {"width":800,"height":600};
}

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
	if (process.platform != 'win32') {
		app.quit();
 	}
});

// Electronの初期化完了後に実行
app.on('ready', function() {
  // メイン画面の表示。ウィンドウの幅、高さを指定できる
  mainWindow = new BrowserWindow({x: bounds["x"], y: bounds["y"],'icon': __dirname + '/icon.ico', width: bounds["width"], height: bounds["height"], 'webPreferences': {'webviewTag': true}});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.setMenu(null);
  
  mainWindow.on('close', function() {
    fs.writeFileSync(boundsFile, JSON.stringify(mainWindow.getBounds()));
});
  // ウィンドウが閉じられたらアプリも終了
  mainWindow.on('closed', function() {
    //mainWindow = null;
    app.quit();
  });
});