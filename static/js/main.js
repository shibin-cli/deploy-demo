import { createApp } from 'vue'
import element from 'element'
import useDeploy from 'deploy'

const App = {
    setup() {
        const { logInfo, deploy,logList } = useDeploy()
        return {
            deploy,
            logInfo,
            logList
        }
    }
}
const app = createApp(App)
app
    .use(element)
    .mount('#app')