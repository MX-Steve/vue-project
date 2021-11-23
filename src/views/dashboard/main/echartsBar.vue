<template>
    <div>
        <div style="width:100%;height:300px;" :id="echarts" class="echarts" ref="echarts"></div>
    </div>
</template>

<script>
    // 引入echarts
    import echarts from 'echarts'

    export default {
        name: 'EchartsBarComponent',
        props: {
            // 接收父组件传递过来的信息
            data: {
                type: Array,
                default: () => []
            },
            color: {
                type: String,
                default: ""
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
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById(this.echarts))
                this.options = {
                    title: {
                        text: this.title
                    },
                    color: [this.color],
                    xAxis: {
                        type: 'category',
                        data: this.data.map(function (item) {
                            return item[0];
                        })
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: this.data.map(function (item) {
                            return item[1];
                        }),
                        type: 'bar'
                    }]
                }
                // 绘制图表
                myChart.setOption(this.options)
            },
            init() {
                var myChart = echarts.init(document.getElementById(this.echarts))
                myChart.setOption(this.options)
            }
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
