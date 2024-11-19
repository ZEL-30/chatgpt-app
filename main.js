import { app, BrowserWindow, screen } from 'electron'

let mainWindow;
let splashWindow;

// 创建加载窗口
const createSplashWindow = () => {
    splashWindow = new BrowserWindow({
        width: 400, // 加载窗口宽度
        height: 300, // 加载窗口高度
        frame: false, // 无边框
        alwaysOnTop: true, // 窗口置顶
        transparent: true, // 窗口透明
        resizable: false, // 禁止缩放
        skipTaskbar: true, // 不在任务栏显示
        webPreferences: {
            devTools: false, // 禁用开发者工具
        },
    });

    splashWindow.loadFile('resource/renderer/views/splash.html') // 加载本地的加载页面
}

// 创建主窗口
const createMainWindow = () => {
    // 获取主屏幕的工作区域尺寸
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    // 定义窗口宽高
    const windowWidth = 1500
    const windowHeight = 900

    // 计算窗口居中位置
    const x = Math.round((screenWidth - windowWidth) / 2)
    const y = Math.round((screenHeight - windowHeight) / 2)

    mainWindow = new BrowserWindow({
        width: windowWidth, // 设置窗口宽度
        height: windowHeight, // 设置窗口高度
        x: x, // 水平方向的起始位置
        y: y, // 垂直方向的起始位置
        icon: 'res/images/chatgpt.ico', // 设置窗口图标
        autoHideMenuBar: true, // 隐藏菜单栏
        // resizable: false, // 禁止缩放窗口
        show: false, // 在加载完成前不显示窗口
    });

    mainWindow.loadURL("https://chat.openai.com/chat"); // 加载网页地址

    // 当尝试打开新窗口时，阻止默认行为，在当前窗口打开
    mainWindow.webContents.setWindowOpenHandler(details => {
        mainWindow.loadURL(details.url);
        return { action: 'deny' }; // 阻止默认行为
    });

    // 当主窗口加载完成时，显示主窗口并关闭加载窗口
    mainWindow.once('ready-to-show', () => {
        if (splashWindow) splashWindow.close(); // 关闭加载窗口
        mainWindow.show(); // 显示主窗口
    });

    // 当加载失败时，显示错误信息
    mainWindow.webContents.on('did-fail-load', () => {
        mainWindow.loadFile('resource/renderer/views/error.html')
    });
}

// 当应用准备就绪后创建窗口
app.whenReady().then(() => {
    createSplashWindow(); // 先创建加载窗口
    createMainWindow(); // 再创建主窗口
});

// 确保在所有窗口关闭时退出应用（macOS 除外）
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 在 macOS 上，当点击 Dock 图标并且没有其他窗口打开时，重新创建窗口
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createSplashWindow();
        createMainWindow();
    }
});
