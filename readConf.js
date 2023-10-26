const loadEnv = async () => {
    const envFileURL = chrome.extension.getURL('.env')
    const config = {} // 创建一个存储配置项的对象

    try {
        const response = await fetch(envFileURL)

        if (response.ok) {
            const envData = await response.text()
            const envLines = envData.split('\n')

            for (const line of envLines) {
                const [key, value] = line.split('=')
                if (key && value) {
                    config[key] = value // 将配置项存储在对象中
                }
            }

            // 返回存储配置项的对象
            return config
        } else {
            console.error("无法加载.env文件")
            return null // 返回 null 表示加载失败
        }
    } catch (error) {
        console.error("加载.env文件时出现错误: " + error)
        return null // 返回 null 表示出现错误
    }
}

module.exports = {
    loadEnv
}