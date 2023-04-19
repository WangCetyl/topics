
/*
	new Date()        2020-04-28T02:12:37.582Z
	getYear()         120  返回距离1900年的年数  已废弃
	getFullYear()     2020 表示哪一年
	getMonth()		  3    表示月份，但是由于是从0开始，所以需要 +1
	getDate()         28   表示那一日 同时区相关
	getDay()          2   表示是一周的第几天 周日为0
	getHours()        10  表示是几点钟，这个跟时区有关系，国内 UTC 相差8个小时
	getMinutes()	  12  表示当前分钟数
	getSeconds()      37  表示档期秒数
	getTime()         time =  1588041076749  方法返回一个时间的格林威治时间数值。相当于+new Date()
	+new Date()       time1 =  1588041076764
*/

var  date0 = new Date()
console.log('date0 =',date0)

var year = date0.getYear()
console.log('year= ',year,"注意 已经废弃")

var fullyear = date0.getFullYear()
console.log('fullyear =',fullyear)

var month = date0.getMonth()
console.log('month =',month)

var date = date0.getDate()
console.log('date =',date)

var day = date0.getDay()
console.log('day ',day)

var hour = date0.getHours()
console.log('hour = ', hour)

var minute = date0.getMinutes()
console.log('minute = ', minute)

var senconds = date0.getSeconds()
console.log('senconds = ', senconds)

var time = date0.getTime()
console.log('time = ', time)

var time1 = +new Date()
console.log('time1 = ', time1)



