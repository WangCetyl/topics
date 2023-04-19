

/*


*/

{
	function test(person){
		person.age = 22
		person = {
			'age':23,
			'name':'hkk'
		}
		return person
	}

	const p1 = {
		'age':21,
		'name':'fhhgk'
	}

	const p2 = test(p1)

	console.log('p1',p1)
	console.log('p2',p2) 
}

4503599627370496
7000000000000000
9007199254740992===9007199254740993
