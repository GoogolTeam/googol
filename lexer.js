function breakup(a) {
	var p = -1;
	var p2 = -1;
	var array = [];
	for(i=0;i<a.length+1;i++) {
		if("+-*/^[]{}(),ABCDEFGH#".includes(a[i])) {
			p = p2;
			p2 = i;
			if(p+1!=p2) array.push(a.slice(p+1,p2));
			array.push(a[i]);
		}
		if(i==a.length) {
			array.push(a.slice(p2+1,a.length));
			return array;
		}
	}
}
