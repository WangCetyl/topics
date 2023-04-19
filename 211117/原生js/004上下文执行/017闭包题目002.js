/*


*/

function fun(n,o) {
    console.log('n=',n)
    console.log('o=',o)
    return {
        fun:function(m){
            return fun(m,n);    
        }
    };
}
var a = fun(0); a.fun(1); a.fun(2); a.fun(3);//undefined,?,?,?
console.log('==========================');
/*
	a = fun(0) => { n = 0 o =undefined;console.log(o) {fun:function(m){return fun(m,n)}} //0,undefined
	a.fun(1) = fum(1,n=0(闭包)) =  {n=1,o=0;console.log(0);{fun:function(m){return fun(m,n)}}//1,0 
	a.fun(2) = fum(2,n=0(闭包)) =  {n=1,o=0;console.log(0);{fun:function(m){return fun(m,n)}}//2,0 
	a.fun(3) = fum(3,n=0(闭包)) =  {n=1,o=0;console.log(0);{fun:function(m){return fun(m,n)}}//3,0 
*/
var b = fun(0).fun(1).fun(2).fun(3);//undefined,?,?,?
console.log('==========================');
/*
	b = fun(0) => { 
		n = 0 o =undefined;
		console.log(o)
		{fun:function(m){return fun(m,n)}
	} //0,undefined
	b.fun(1) = fum(1,n=0(闭包)) =  {
		n=1,o=0;console.log(0);
		{
			fun:function(m){
				return fun(m,n)
			}
		}//1,0 
	b.fun(1).fun(2) = fum(2,n=1(闭包)) =  {n=2,o=1;console.log(0);{fun:function(m){return fun(m,n)}}//2,1
	b.fun(1).fun(2).fun(3) = fum(3,n=0(闭包)) =  {n=3,o=2;console.log(0);{fun:function(m){return fun(m,n)}}//3,2 
*/
var c = fun(0).fun(1); c.fun(2); c.fun(3);//undefined,?,?,?
/*
	c = fun(0).fun(1) => fum(1,n=0(闭包)) =  {
		n=1,o=0;
		console.log(0);
		{fun:function(m){return fun(m,n)}
	}//1,0 

	c.fun(2) = fum(2,n=1(闭包)) =  {n=2,o=1;console.log(0);{fun:function(m){return fun(m,n)}}//2,1
	c.fun(3) = fum(3,n=1(闭包)) =  {n=3,o=2;console.log(0);{fun:function(m){return fun(m,n)}}//3,1 
*/
