const n=`---
title: 我的 2023 年终端命令使用报告
abbrlink: b9e2a01c
date: 2024-01-15T16:29:04+0800
updated: 2024-01-15T16:29:04+0800
tags: cmd-report
summaryZh: 作者分享了2023年的终端命令使用报告。报告显示全年共输入了5266条命令，最活跃的月份是8月，最活跃的星期是周四。Git、ls、cd是使用频率最高的命令。这份报告生动地记录了一个开发者的日常工作状态。
summaryEn: The author shares their 2023 terminal command usage report. The report shows a total of 5266 commands entered throughout the year, with August being the most active month and Thursday the most active weekday. Git, ls, and cd were the most frequently used commands. This report vividly records the daily work status of a developer.
---

My command report of 2023 by [cmd-wrapped](https://github.com/YiNNx/cmd-wrapped):

## Commands - 5266

- In 2023, you entered the very first command \`flutter doctor\` on 02-09 at 15:24.
- Throughout the year, a total of 5266 commands were entered. (Total in history: 6219)
- On 2023-04-04, a peak of 211 commands were entered in a single day.
  
## Command Graph 2023

<!--
Original ASCII Graph:
     ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
    │  Jan       Feb     Mar     Apr       May     Jun     Jul       Aug     Sep     Oct       Nov     Dec         │
    │                ■       ■ ■ ■     ■             ■   ■         ■   ■                                   ■   ■   │
    │              ■   ■ ■ ■ ■ ■ ■ ■ ■ ■   ■ ■   ■ ■       ■   ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■   ■   ■ ■ ■ ■     ■   ■       │
    │              ■ ■ ■ ■ ■ ■ ■ ■ ■ ■     ■ ■     ■ ■ ■ ■ ■   ■   ■ ■ ■ ■ ■ ■ ■ ■ ■   ■ ■ ■ ■ ■ ■     ■ ■ ■       │
    │              ■ ■ ■   ■ ■   ■ ■ ■ ■     ■ ■ ■ ■ ■ ■   ■   ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■   ■ ■   ■ ■ ■ ■ ■ ■ ■ ■ ■     │
    │            ■   ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■     ■ ■   ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■   ■ ■   ■ ■   ■ ■ ■   ■ ■   ■ ■     │
    │            ■   ■ ■   ■ ■   ■ ■ ■ ■   ■   ■ ■ ■         ■ ■ ■ ■ ■ ■ ■   ■ ■ ■ ■   ■   ■ ■ ■ ■ ■   ■ ■ ■ ■     │
    │                ■ ■     ■ ■ ■     ■                         ■ ■   ■           ■ ■                   ■   ■     │
     ______________________________________________________________________________________________________________
-->
![Command Graph 2023](/images/CmdReport2023/command_calendar_2023.svg)

## Most Active Month - August

<!--
Chart Data: Most Active Month
{
  "xAxis": ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  "series": [
    { "name": "Commands", "data": [366, 450, 950, 211, 483, 234, 1258, 374, 150, 243, 547] }
  ]
}
-->
![Most Active Month](/images/CmdReport2023/active_month.svg)

## Most Active Weekday - Thu

<!--
Chart Data: Most Active Weekday
{
  "xAxis": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "series": [
    { "name": "Commands", "data": [728, 956, 672, 1068, 1039, 480, 323] }
  ]
}
-->
![Most Active Weekday](/images/CmdReport2023/active_weekday.svg)

## Most Active Time - Afternoon

<!--
Chart Data: Most Active Time
{
  "xAxis": ["7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "0", "1", "2", "3", "4", "5", "6"],
  "series": [
    { "name": "Commands", "data": [0, 5, 148, 522, 595, 209, 28, 575, 663, 476, 560, 376, 223, 472, 184, 81, 81, 49, 18, 0, 0, 1, 0, 0] }
  ]
}
-->
![Most Active Time](/images/CmdReport2023/active_time.svg)


## Favorite Commands

<!--
Chart Data: Favorite Commands
{
  "yAxis": ["chmod", "pnpm", "npm", "pwd", "flutter", "fvm", "adb", "cd", "ls", "git"],
  "series": [
    { "name": "Count", "data": [91, 139, 157, 214, 287, 290, 383, 550, 649, 721] }
  ]
}
-->
![Favorite Commands](/images/CmdReport2023/favorite_commands.svg)

## Also Frequently Used

<!--
Chart Data: Also Frequently Used
{
  "yAxis": ["bash", "omz", "jarsigner", "(empty)", "vim", "ping", "hexo", "command", "source", "apksigner", "./gradlew", "echo", "export", "brew", "java"],
  "series": [
    { "name": "Count", "data": [30, 30, 31, 32, 42, 43, 43, 47, 48, 51, 52, 64, 76, 78, 80] }
  ]
}
-->
![Also Frequently Used Commands](/images/CmdReport2023/also_frequently_used.svg)



All 2023 command line stats wrapped!
`;export{n as default};
