(function(){
	function step(a) {
		var p = -1;
		var p2 = -1;
		for(var i=0;i<a.length;i++) {
			if(a[i]=="+"||a[i]=="-"||a[i]=="*"||a[i]=="/")  {
					p2 = p;
					p = i;
				}
			}
		var b = {ignored:a.slice(0,p2+1),base:a.slice(p2+1,p),sign:a[p],iterator:a.slice(p+1,a.length)};
		if(b.sign=="+") return b.ignored+((+b.base)+(+b.iterator));
		if(b.sign=="-") return b.ignored+(b.base-b.iterator);
		if(b.sign=="*") return b.ignored+(b.base*b.iterator);
		if(b.sign=="/") return b.ignored+(b.base/b.iterator);
	}
googol.notations.basicmath=step
})()
