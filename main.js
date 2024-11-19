import { app, BrowserWindow } from 'electron'

// 创建窗口
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1500, // 设置窗口宽度(单位: 像素)
        height: 900, // 设置窗口高度(单位: 像素)
        icon: 'res/images/chatgpt.ico', // 设置窗口图标
        autoHideMenuBar: true, // 隐藏菜单栏
        // resizable: false, // 禁止缩放窗口
        x: 0, // x 表示窗口距离屏幕左边缘的距离
        y: 0, // y 表示窗口距离屏幕顶部的距离
    })

    mainWindow.loadURL("https://chat.openai.com/chat") // 加载网页地址

    // 当尝试打开新窗口时, 阻止默认行为, 在当前窗口打开
    mainWindow.webContents.setWindowOpenHandler(details => {
        mainWindow.loadURL(details.url)
        return { action: 'deny' } // 阻止默认行为
    })
}

// 当应用准备就绪后创建窗口
app.whenReady().then(() => {
    createWindow()
})