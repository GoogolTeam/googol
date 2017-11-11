(function(){
	function pow(x,y){
		return Math.pow(x,y)
	}
	function step(x){
		var expr=-1
		var rep=0
		var sep=0
		var op=0
		const opcodes="EFGHD"
		var length=x.length
		for(var i=0;i<length;i++){
			if(opcodes.search(x[i])>-1){
				expr=i
				rep=sep=i+1
				op=opcodes.search(x[i])
			}
		}
		console.log(expr,rep,sep)
		if(expr==-1){
			return x
		}
		if(rule==1){
			var ret=x.slice(expr+1,length)
			const chars="EFGH"
			if(ret<1){
				ret="E"+ret
			}else{
				ret=chars[op-5]+chars[op-4]+(ret-1)
			}
			return x.slice(0,expr)+ret
		}
	}
	googol.notations.letters=step
	console.log(step)
})()