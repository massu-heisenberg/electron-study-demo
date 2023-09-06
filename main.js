// Modules to control application life and create native browser window
const { app, BrowserWindow, Notification, clipboard } = require("electron");
const path = require("path");
const robot = require("@jitsi/robotjs");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // createWindow()
  showAppStartNotification();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    // if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  showAppEndNotification();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  showAppEndNotification();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function showAppStartNotification() {
  new Notification({ title: "NOTIFICATION", body: "APP START" }).show();
}

function showAppEndNotification() {
  new Notification({ title: "NOTIFICATION", body: "APP END" }).show();
}

let clipboardContentOrigin = clipboard.readText();
let clipboardContent = clipboardContentOrigin;

function getClipboardContent() {
  clipboardContent = clipboard.readText();
  if (!clipboardContent || clipboardContentOrigin === clipboardContent) return;
  console.log("剪切板内容：", clipboardContent);
  const textToCopy = clipboardContent;
  clipboard.writeText(textToCopy);
  clipboardContent = clipboard.readText();
  console.log("剪切板内容：", clipboardContent);
  // 把内容写回剪切板
  clipboard.writeText(clipboardContent);
  console.log("返回的内容：", clipboardContent);
}

setInterval(() => {
  getClipboardContent();
}, 500);

// // 在主进程中监听鼠标位置
// setInterval(() => {
//   const mouse = robot.getMousePos();
//   // Get pixel color in hex format.
//   var hex = robot.getPixelColor(mouse.x, mouse.y);
//   console.log("#" + hex + " at x:" + mouse.x + " y:" + mouse.y);
//   console.log("鼠标位置：", mouse);
// }, 1000); // 每秒获取一次鼠标位置
