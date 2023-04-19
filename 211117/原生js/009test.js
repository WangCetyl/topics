function log() {
	console.log.apply(null,arguments)
}

log(1)
log(12,2,3)


function log1() {
	console.log.apply(console,arguments)
}

log1(1)
log1(12,2,3)


function log2(){
	const args = Array.prototype.slice.call(arguments);
	args.unshift('(hello)');
	console.log.apply(console, args);
};

log2(1)
log2(12,2,3)
