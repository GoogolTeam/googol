(function(){
function proc(x,y,a,n) {     // gets nth term of "FS" of UNAN rray a a, given base x for continuous UNAN. Called by step() if first entry of array is 0.
	var pos = 0;
	var pos2 = 0;    // counters for positions in the string of the array
	for (var i=0;i<a.length;i++) {
			if(a[i]==","&&a[i+1]!="0"||a[i+2]==".") {    // Found a comma followed by nonzero entry
			pos = i;
			for(var j=pos+1;j<a.length;j++) {
				if(a[j]==","||a[j]=="{"||a[j]=="]") {
					pos2 = j; // found the end of the entry immediately following the comma
					break;
				}
			}
			var c = {start:a.slice(0,pos-1),middle:a.slice(pos+1,pos2),end:a.slice(pos2,a.length)};
			if(c.middle-Math.ceil(c.middle)+1==1) {
				c.middle--;
				return c.start+n+","+c.middle+c.end;
				}
			var arg = x*(c.middle-Math.ceil(c.middle)+1);  // new entry for continuous UNAN
			if(-0.000000001<arg-Math.round(arg)&&arg-Math.round(arg)<0.000000001) arg=Math.round(arg);
			c.middle = Math.ceil(c.middle)-1;
			return c.start+arg+","+c.middle+c.end;
		}
		if(a[i]=="}"&&a[i+1]!="0"||a[i+2]==".") {  // found a nonzero entry after a separator
			pos = i;
			pos2 = i;
			while(a[pos2]!="{") {   // find the start of the separator
				pos2--;
			}
			for(var j=pos;j<a.length;j++) {   // find end of the entry after the }
				if(a[j]==","||a[j]=="{"||a[j]=="]") {
					pos = j;
					break;
				}
			}
			var f = {start:a.slice(0,pos2-1),middle:a.slice(pos2-1,pos),end:a.slice(pos,a.length)}
			var left = f.middle.search("\\{");
			var right = f.middle.search("\\}");
			var g = {sep:f.middle.slice(left+1,right),num:f.middle.slice(right+1,f.middle.length)};
			if(sep[0]==0&&sep[1]!=".") return f.start+"{"+proc(x,y,sep,n)+"}"+"1"+"{"+sep+"}"+(g.num-1)+f.end;    // separator starts with 0;
			var m = g.sep.search("\\,")
			var h = {start:g.sep.slice(0,m)-1,end:g.sep.slice(m,g.sep.length)};
			var rep = "0"+"{"+h.start+h.end+"}";
			return f.start+rep.repeat(Math.floor(n))+Math.pow(x,y-Math.floor(y))+"{"+g.sep+"}"+(g.num-1)+f.end;
		}
	}
}

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
		if(b.array.slice(i,i+3)==",0}") {
			b.array = b.array.slice(0,i)+b.array.slice(i+3,b.array.length);
			return b.ignored+b.base+"["+b.array+b.iterator;
		}
		if(b.array.slice(i,i+3)=="}0}") {
			var j=i-1;
			while(b.array[j]!="}"||b.array[j]!=",") j--;
			b.array = b.array.slice(0,j+2)+b.array.slice(i+3,b.array.length);
			return b.ignored+b.base+"["+b.array+b.iterator;
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
	if(b.array[0]==0&&b.array[1]!=".") { 
		if(b.iterator<=2) return b.ignored+b.base+"["+proc(b.base,b.iterator,b.array.slice(0,b.array.length-1),2)+"]"+Math.pow(b.base,b.iterator-1);
		return b.ignored+b.base+"["+proc(b.base,b.iterator,b.array.slice(0,b.array.length-1),b.iterator)+"]"+b.base;
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
