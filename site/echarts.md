title: nodeppt 富媒体&插件演示
speaker: 三水清
url: https://github.com/ksky521/nodeppt
js:
    - https://echarts.cdn.apache.org/zh/asset/theme/infographic.js
plugins:
    - echarts: {theme: infographic}

<slide class="bg-black-blue aligncenter" image="https://source.unsplash.com/Zq_K89I9E-8/ .dark">

Echarts {.text-subtitle.animated.fadeInDown.delay-800}
# nodeppt {.text-landing.text-shadow}

这可能是迄今为止最好的网页版演示库 {.text-intro}

[:fa-github: Github](https://github.com/ksky521/nodeppt){.button.ghost}


<slide class="aligncenter">

## Echarts

<slide :class="size-60">
## Echarts {.aligncenter}


<slide :class="size-60">
## echarts {.aligncenter}

```echarts {style="height:100%;width:100%;"}
{
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '30%'],

            label: {
                normal: {
                    position: 'inner'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'直达', selected:true},
                {value:679, name:'营销广告'},
                {value:1548, name:'搜索引擎'}
            ]
        },
        {
            name:'访问来源',
            type:'pie',
            radius: ['40%', '55%'],
            label: {
                normal: {
                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    // shadowBlur:3,
                    // shadowOffsetX: 2,
                    // shadowOffsetY: 2,
                    // shadowColor: '#999',
                    // padding: [0, 7],
                    rich: {
                        a: {
                            color: '#999',
                            lineHeight: 22,
                            align: 'center'
                        },
                        // abg: {
                        //     backgroundColor: '#333',
                        //     width: '100%',
                        //     align: 'right',
                        //     height: 22,
                        //     borderRadius: [4, 4, 0, 0]
                        // },
                        hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },
                        b: {
                            fontSize: 16,
                            lineHeight: 33
                        },
                        per: {
                            color: '#eee',
                            backgroundColor: '#334455',
                            padding: [2, 4],
                            borderRadius: 2
                        }
                    }
                }
            },
            data:[
                {value:335, name:'直达'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1048, name:'百度'},
                {value:251, name:'谷歌'},
                {value:147, name:'必应'},
                {value:102, name:'其他'}
            ]
        }
    ]
}

```


<slide class="bg-primary" :class="size-60 frame">

## View More Demos? {.text-serif.aligncenter}

\* \* \* {.text-symbols}

<nav class="aligncenter">
* [:fa-th-large: Layout](./layout.html)
* [:fa-tv: Background](./background.html)
* [:fa-magic: Animation](./animation.html)
* [:fa-cube: Component](./component.html)
* [:fa-css3: Classes](./index.html)
</nav>

<slide class="aligncenter">

## U work so hard, **but** 干不过 write PPTs

快使用 [nodeppt](https://github.com/ksky521/nodeppt) 轻松搞定高大上PPT<br/> nodeppt 助力你的人生逆袭之路！ {.text-into}

[:fa-cloud-download: Github](https://github.com/ksky521/nodeppt){.button}
