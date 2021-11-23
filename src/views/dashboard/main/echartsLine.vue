<template>
    <div>
        <div style="width:100%;height:600px;" :id="echarts" class="echarts" ref="echarts"></div>
    </div>
</template>

<script>
    // 引入echarts
    import echarts from 'echarts'

    export default {
        name: 'EchartsLineComponent',
        props: {
            // 接收父组件传递过来的信息
            successData: {
                type: Array,
                default: () => []
            },
            errorData: {
                type: Array,
                default: () => []
            },
            title: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                options: {}
            }
        },
        watch: {
            //观察option的变化
            options: {
                handler(newVal, oldVal) {
                    if (this.myChart) {
                        if (newVal) {
                            this.myChart.setOption(newVal);
                        } else {
                            this.myChart.setOption(oldVal);
                        }
                    } else {
                        this.init();
                    }
                },
                deep: true //对象内部属性的监听，关键。
            }
        },
        methods: {
            drawChart() {
                const vm = this
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById(this.echarts))
                this.options = {
                    title: {
                        text: this.title
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['发布成功', '发布失败']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.successData.map(function (item) {
                            return item[0];
                        }),
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '发布成功',
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#1EA362', //改变折线点的颜色
                                    lineStyle: {
                                        color: '#1EA362' //改变折线颜色
                                    }
                                }
                            },
                            data: this.successData.map(function (item) {
                                return item[1];
                            })
                        },
                        {
                            name: '发布失败',
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#B43431', //改变折线点的颜色
                                    lineStyle: {
                                        color: '#B43431' //改变折线颜色
                                    }
                                }
                            },
                            data: this.errorData.map(function (item) {
                                return item[1];
                            })
                        }
                    ]
                }
                // 绘制图表
                myChart.setOption(this.options)
            },
            init() {
                var myChart = echarts.init(document.getElementById(this.echarts))
                myChart.setOption(this.options)
            },
        },
        computed: {
            echarts() {
                return 'echarts' + Math.random() * 100000
            }
        },
        mounted: function () {
            const vm = this
            vm.$nextTick(() => {
                vm.drawChart()
            })
        },
        created: () => {
        }
    }
</script>

<style scoped lang="scss">
</style>
