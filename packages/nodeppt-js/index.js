import WebSlides from 'webslides/src/js/modules/webslides'
import './assets/scss/full.scss'

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const echartsNode = document.querySelectorAll('.echarts')
    const echartsData = document.querySelectorAll('.echarts-data')
    //- echarts
    const len = echartsNode.length
    const echartsChart = []
    const echartsOption = []
    for (let j = 0; j < len; j++) {
      const et = (echartsChart[j] = echarts.init(echartsNode[j]))
      try {
        echartsOption[j] = JSON.parse(echartsData[j].innerHTML.trim())
        et.setOption(echartsOption[j])
      } catch (e) {
        console.log(e)
      }
    }
  },
  false
)

export default WebSlides
