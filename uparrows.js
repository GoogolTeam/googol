(function(){
	function step(a) {
		var p1 = -1;
		var p2 = -1;
		var p3 = -1;
		if(a.search("\\^")==-1) return a;
		for(var i=0;i<a.length;i++) {
			if(a[i]=="^")  {
				if(a[i-1]!="^") p2 = i;
				if(a[i+1]!="^") {
					p1 = p3;
					p3 = i;
				}
			}
		}
		var b = {ignored:a.slice(0,p1+1),base:a.slice(p1+1,p2),arrows:a.slice(p2,p3+1),iterator:a.slice(p3+1,a.length)};
		if(b.arrows=="^") return b.ignored+Math.pow(b.base,b.iterator);
		if(b.iterator<=1) return b.ignored+Math.pow(b.base,b.iterator);
		return b.ignored+b.base+b.arrows.slice(0,b.arrows.length-1)+b.base+b.arrows+(b.iterator-1);
	}
googol.notations.uparrows=step
})()
