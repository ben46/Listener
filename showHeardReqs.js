
// 1. 检查消息是否满足特定条件
function isXueqiuRequest(msg) {
    return msg.request.url.indexOf("xueqiu.com") >= 0 && msg.request.method === "GET"
}

// 2. 处理响应消息中的内容
function processResponse(ws, msg, count, DJANGO) {
    if (!msg.response.body.content || msg.response.body.content == null || msg.response.body.content === null) {
        return
    }

    let content_json = null
    try {
        content_json = JSON.parse(msg.response.body.content)
    } catch (e) {
        return
    }

    if (content_json.result && content_json.result.length > 0) {
        // 转发消息实时推送
        ws.send(JSON.stringify({
            "type": 1,
            "data": msg.response.body.content
        }))

        // 把消息通过 django 存入数据库
        sendToDjango(DJANGO, msg.response.body.content)
    }
}

// 3. 发送数据到 Django 服务器
function sendToDjango(DJANGO, content) {
    fetch(`http://${DJANGO}`, {
        method: 'post',
        body: content
    }).then(function (r) {
        return r
    }).then(function (data) {
        console.log(new Date())
        console.log("trade in ms:")
        var _t1 = (new Date()).getTime()
        console.log(_t1 - _t0)
        console.log(data)
        show = true
    })
}

// 4. 处理心跳请求
function handleHeartbeat(DJANGO, item, _t0) {
    if (item.name === "Content-Length" || item.name.startsWith(':')) {
        return
    }

    if (item.name.indexOf("ookie") <= 0) {
        return
    }

    console.log(item.value)
    fetchHeartbeat(DJANGO, item.value, _t0)
}

// 5. 发送心跳请求到 Django 服务器
function fetchHeartbeat(DJANGO, itemValue, _t0) {
    fetch(`http://${DJANGO}/zh_conf/cookie/updatecookie/`, {
        method: 'post',
        body: itemValue
    }).then(function (r) {
        console.log(new Date())
        console.log("send heart beat in ms:")
        var _t1 = (new Date()).getTime()
        console.log(_t1 - _t0)
        return r
    }).then(function (data) {
        console.log(data)
        show = true
    }).catch((err) => {
        console.error(err)
    })
}

// 6. 主函数，调用上述函数
function showHeardReqs(ws, msg) {
    const DJANGO = "192.168.0.122:8000"
    msg.count = count
    reqCache[count] = msg

    if (!isXueqiuRequest(msg)) {
        console.log("not xueqiu")
        return
    }

    var _t0 = (new Date()).getTime()
    // 转发消息
    processResponse(ws, msg, count, DJANGO)

    if (parseInt((new Date()).getTime() / 1000) % 3 !== 0) {
        return
    }

    // 发送心跳, 更新 cookie
    const har = msg.request
    har.headers.forEach(item => {
        handleHeartbeat(DJANGO, item, _t0)
    })
}

export default {
    showHeardReqs
}