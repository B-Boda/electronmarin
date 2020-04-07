"use strict";

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const fs = require("fs");
const localShortcut = require("electron-localshortcut")
var mainWindow;
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
	mainWindow = new BrowserWindow({
		x: bounds["x"],
		y: bounds["y"],
		'icon': __dirname + '/icon.ico',
		width: bounds["width"],
		height: bounds["height"],
		'webPreferences': {'webviewTag': true}
	});
	mainWindow.loadURL('file://' + __dirname + '/index.html');
	mainWindow.setMenu(null);

	mainWindow.on('close', function() {
		fs.writeFileSync(boundsFile, JSON.stringify(mainWindow.getBounds()));
	});
	
	mainWindow.on('closed', function() {
		app.quit();
	});

	localShortcut.register(mainWindow, "F5", function() {
		mainWindow.reload()
	});

	localShortcut.register(mainWindow, "F12", function() {
		mainWindow.openDevTools();
	});
});
