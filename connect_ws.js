function connect_ws() {
    const WS_SERVER_ADDR = "192.168.0.122:4000"
    var ws
    if ("WebSocket" in window) {
        ws = new WebSocket(`ws://${WS_SERVER_ADDR}`)
        ws.onopen = function () {
            console.log("ws connected")
            // Web Socket 已连接上，使用 send() 方法发送数据
            ws.send("sending msg")
        }
        ws.onmessage = function (evt) {
            var received_msg = evt.data
        }
        ws.onclose = function () {
            setTimeout(connect_ws, 1000)
        }
    } else {
        // 浏览器不支持 WebSocket
        alert("your browser do not support WebSocket!")
    }
    return ws
}

export default {
    connect_ws
}