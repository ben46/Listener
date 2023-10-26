
function showHeardReqs(ws, msg) {
    const DJANGO = "192.168.0.122:8000"
    msg.count = count

    reqCache[count] = msg
    let tabPanelId = 'collapse' + count
    //let buttonA = createButtonA(tabPanelId);
    if (msg.request.url.indexOf("xueqiu.com") < 0) {
        console.log("not xueqiu")
        return
    }

    if (msg.request.method != "GET") {
        console.log("not get")
        return
    }
    var _t0 = (new Date()).getTime()

    if (!msg.response.body.content
        || msg.response.body.content == null
        || msg.response.body.content === null) {
        return
    }
    let content_json = null
    try {
        content_json = JSON.parse(msg.response.body.content)
    } catch (e) {
        return
    }
    if (content_json.result && content_json.result.length > 0) {
        ws.send(JSON.stringify({
            "type": 1,
            "data": msg.response.body.content
        }))
        fetch(`http://${DJANGO}`, {
            method: 'post',
            body: msg.response.body.content
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
        return
    }
    if (parseInt((new Date()).getTime() / 1000) % 3 != 0) {
        //} else if (parseInt((new Date()).getTime() / 1000) ){
        return
    }
    const har = msg.request
    har.headers.forEach(item => {
        let condition = !(item.name === "Content-Length") && !item.name.startsWith(':')
        if (false == condition) {
            return
        }
        _nm = item.name + ""
        let condition2 = _nm.indexOf("ookie") > 0
        if (false == condition2) {
            return
        }
        console.log(item.value)
        fetch(`http://${DJANGO}/zh_conf/cookie/updatecookie/`, {
            method: 'post',
            body: item.value
        }).then(function (r) {
            console.log(new Date())
            console.log("send heart beat in ms:")
            var _t1 = (new Date()).getTime()
            console.log(_t1 - _t0)
            return r
            // return r.json();
        }).then(function (data) {
            console.log(data)
            show = true
        }).catch((err) => {
            console.error(err)
        })
    })
}

export default {
    showHeardReqs
}