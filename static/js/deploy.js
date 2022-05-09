import { ref, reactive } from 'vue'
import io from 'io'
export default function useDeploy() {
    const logInfo = ref('')
    const socket = io()
    const logList= reactive([])
    function deploy() {
        logInfo.value = '后端部署中，请稍等...'
        axios.post('/deploy')
            .then((res) => {
                // 部署完成，返回 log
                console.log(res.data);
                logInfo.value = res.data.msg
            })
            .catch(function (err) {
                console.log(err);
            })
    }

  
    socket.on('deploy-log', (msg) => {
        logList.push(msg)
    })
    return {
        logInfo,
        deploy,
        logList
    }
}
