(function(){
	function step(a) {
		var p = -1;
		var p2 = -1;
		if(a.search("\\[")==-1) return a;
		for(var i=0;i<a.length;i++) {
			if(a[i]=="[")  {
				s = i;
			}
			if(a[i]=="]")  {
				p2 = p;
				p = i;
			}
		}
		var b = {ignored:a.slice(0,p2+1),base:a.slice(p2+1,s),array:a.slice(s+1,p+1),iterator:a.slice(p+1,a.length),array2:a.slice(s+1,p+1)};
		var pos = 0;
		var pos2 = 0;
		for(var i=0;i<b.array.length;i++) {
			if(b.array.slice(i,i+3)=="{0}") {
				pos = i;
				var d = {start:b.array.slice(0,pos),end:b.array.slice(pos+3,b.array.length)}
				return b.ignored+b.base+"["+d.start+","+d.end+b.iterator;
			}
		}
		if(b.array=="0]")  return b.ignored+b.base*b.iterator;
		if(b.iterator<=1) return b.ignored+Math.pow(b.base,b.iterator);
		if(b.array.slice(b.array.length-3,b.array.length)==",0]") {
			b.array = b.array.slice(0,b.array.length-3)+"]";
			return b.ignored+b.base+"["+b.array+b.iterator;
		}
		if(b.array.slice(b.array.length-3,b.array.length)=="}0]") {
			pos = b.array.length;
			while(b.array[pos]!="{") {
				pos--;
			}
			b.array = b.array.slice(0,pos);
			return b.ignored+b.base+"["+b.array+"]"+b.iterator;
		}
		if(b.array[0]==0) {
			for (var i=0;i<b.array.length;i++) {
				if(b.array[i]==","&&b.array[i+1]!="0"||b.array[i+2]==".") {
					pos = i;
					for(var j=pos+1;j<b.array.length;j++) {
						if(b.array[j]==","||b.array[j]=="{"||b.array[j]=="]") {
							pos2 = j;
							break;
						}
					}
					var c = {start:b.array.slice(0,pos-1),middle:b.array.slice(pos+1,pos2),end:b.array.slice(pos2,b.array.length)};
					if(c.middle-Math.ceil(c.middle)+1==1) {
						c.middle--;
						if(b.iterator<=2) return b.ignored+b.base+"["+c.start+2+","+c.middle+c.end+(2*Math.pow(b.base/2,b.iterator-1));
						return b.ignored+b.base+"["+c.start+b.iterator+","+c.middle+c.end+b.base;
					}
					var arg = b.base*(c.middle-Math.ceil(c.middle)+1);
					if(-0.000000001<arg-Math.round(arg)&&arg-Math.round(arg)<0.000000001) arg=Math.round(arg);
					c.middle = Math.ceil(c.middle)-1;
					return b.ignored+b.base+"["+c.start+arg+","+c.middle+c.end+b.base;
				}
				if(b.array[i]=="}"&&b.array[i+1]!="0"||b.array[i+2]==".") {
					pos = i;
					pos2 = i;
					while(b.array[pos2]!="{") {
						pos2--;
					}
					for(j=pos;j<b.array.length;j++) {
						if(b.array[j]==","||b.array[j]=="{"||b.array[j]=="]") {
							pos = j;
							break;
						}
					}
					var f = {start:b.array.slice(0,pos2-1),middle:b.array.slice(pos2-1,pos),end:b.array.slice(pos,b.array.length)}
					var left = f.middle.search("\\{");
					var right = f.middle.search("\\}");
					var g = {sep:f.middle.slice(left+1,right),num:f.middle.slice(right+1,f.middle.length)};
					var rep = "0"+"{"+(g.sep-1)+"}";
					return b.ignored+b.base+"["+f.start+rep.repeat(Math.floor(b.iterator))+Math.pow(b.base,b.iterator-Math.floor(b.iterator))+"{"+g.sep+"}"+(g.num-1)+f.end+b.base;
				}
			}
		}
		for(var i=0;i<b.array.length;i++) {
			if(b.array[i]==","||b.array[i]=="{"||b.array[i]=="]") {
				pos = i;
				break;
			}
		}
		var num = b.array.slice(0,pos);
		var rest = b.array.slice(pos,b.array.length);
		if(Math.ceil(num)-num+1==1) {
			num = Math.floor(num)-1;
			b.array2 = num+rest;
			return b.ignored+b.base+"["+b.array2+b.base+"["+b.array+(b.iterator-1)
		}
		var num2 = Math.ceil(num);
		b.array2 = num2+rest;
		return b.ignored+b.base+"["+b.array2+(2*Math.pow(b.base/2,num-Math.ceil(num)+1));
	}
	googol.notations.unan=step
})()
