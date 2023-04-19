Array.prototype.mySet = function mySet() {
	let temObj = {}
	for(let i=0; i<this.length; i++ ) {
		let res = this[i]
		if(temObj[res] == res ) {
			this[i] = this[this.length-1]
			this.length--
			i--
			continue
		}
		temObj[res] = res
	} 
	temObj = null
	return this
}