String.prototype.repeat||(String.prototype.repeat=function(t){"use strict";if(null==this)throw new TypeError("can't convert "+this+" to object");var r=""+this;if(t=+t,t!=t&&(t=0),0>t)throw new RangeError("repeat count must be non-negative");if(t==1/0)throw new RangeError("repeat count must be less than infinity");if(t=Math.floor(t),0==r.length||0==t)return"";if(r.length*t>=1<<28)throw new RangeError("repeat count must not overflow maximum string size");for(var e="";1==(1&t)&&(e+=r),t>>>=1,0!=t;)r+=r;return e});
function $(id){return document.getElementById(id)}

function golf() {
    $("code").value = $("code").value.replace(/\s/g, "").replace(/\.+$/, "");
}

function cube() {
    var code = $("code").value.replace(/\s/g,"");
    var size = Math.ceil(Math.sqrt(code.length / 6));
    while (code.length < size * size * 6) code += ".";
    var result = "",
        i = 0,
        j = 0,
        c = 0;
        
    for (i = 0; i < size; i++) {
        result += "  ".repeat(size);
        for (j = 0; j < size; j++, c++) {
            result += code[c] + " ";
        }
        result = result.replace(/ $/, "\n");
    }
    
    for (i = 0; i < size; i++) {
        for (j = 0; j < size * 4; j++, c++) {
            result += code[c] + " ";
        }
        result = result.replace(/ $/, "\n");
    }
    
    for (i = 0; i < size; i++) {
        result += "  ".repeat(size);
        for (j = 0; j < size; j++, c++) {
            result += code[c] + " ";
        }
        result = result.replace(/ $/, "\n");
    }
    
    $("code").value = result;
}

var interval = -1,
    pause = function pause(){};

function run() {
    $("output").value = "";
    var code = $("code").value.replace(/\s/g,"");
    var size = Math.ceil(Math.sqrt(code.length / 6));
    while (code.length < size * size * 6) code += ".";
    var board = [];
    var i = 0,
        j = 0,
        k = 0,
        c = 0,
        p = 0;
        
    for (i = 0; i < 6; i++) {
        board[i] = [];
    }
    for (i = 0; i < size; i++) {
        board[0][i] = "";
        for (j = 0; j < size; j++, c++) {
            board[0][i] += code[c];
        }
    }
    
    for (i = 0; i < size; i++) {
        for (j = 1; j < 5; j++) {
            board[j][i] = "";
            for (k = 0; k < size; k++, c++) {
                board[j][i] += code[c];
            }
        }
    }
    
    for (i = 0; i < size; i++) {
        board[5][i] = "";
        for (j = 0; j < size; j++, c++) {
            board[5][i] += code[c];
        }
    }
    
    console.log(board.map(function(a) {
        return a.map(function(b) {
            return b.split("").join(" ")
        }).join("\n")
    }).join("\n\n"));
    
    var ip = {
        f: 1,
        x: 0,
        y: 0,
        d: 0
    }, state = "", stack = [], input = $("input").value;
    
    function update() {
        var char = board[ip.f][ip.y][ip.x];
        $("debug").checked && console.log("face:",ip.f,"x:",ip.x,"y:",ip.y,"dir:","ESWN"[ip.d],"char:",char,"stack:",stack.slice(),"state:",state);
        if (state === "rotate-l") ip.d = (ip.d + 3) % 4, state = "";
        else if (state === "rotate-r") ip.d = (ip.d + 1) % 4, state = "";
        
        if (state === "skip") state = "";
        else if (state === "char") stack.push(char.charCodeAt(0)), state = "";
        else if (state === "string") char === "\"" ? state = "" : stack.push(char.charCodeAt(0));
        
        else if (/\d/.test(char)) stack.push(+char);
        else if (char === "N") stack.push(10);
        else if (char === "Q") stack.push(34);
        else if (char === "S") stack.push(32);
        else if (char === "'") state = "char";
        else if (char === '"') state = "string";
        
        else if (char === "&") stack.push(+[stack.pop()||"0",stack.pop()||""].reverse().join(""));
        else if (char === "#") stack.push(stack.length);
        else if (char === ";") stack.pop();
        else if (char === ":") stack.push(stack[stack.length-1]||0);
        else if (char === "s") stack.push((stack.pop()||0), (stack.pop()||0));
        else if (char === "r") stack.push.apply(stack, stack.splice(-3, 2));
        else if (char === "q") stack.unshift((stack.pop()||0));
        else if (char === "t") { if(stack.length) stack.push(stack.splice(~stack.pop(), 1)[0]); }
        
        else if (char === "o") $("output").value += String.fromCharCode(stack[stack.length-1]);
        else if (char === "O") $("output").value += stack[stack.length-1] || 0;
        else if (char === "i") stack.push(input ? input.charCodeAt(0): -1), input = input.slice(1);
        else if (char === "A") { stack.push(-1); for (var i = input.length; i-- > 0; ) stack.push(input.charCodeAt(i)); input = ""; }
        else if (char === "I") stack.push(+(input.match(/-?\d+/)||[-1])[0] || 0), input = input.replace(/^.*?\d+/,"");
        
        else if (char === ">") ip.d = 0;
        else if (char === "v") ip.d = 1;
        else if (char === "<") ip.d = 2;
        else if (char === "^") ip.d = 3;
        else if (char === "/") ip.d ^= 3;
        else if (char === "\\") ip.d ^= 1;
        else if (char === "|") ip.d = [2,1,0,3][ip.d];
        else if (char === "_") ip.d = [0,3,2,1][ip.d];
        else if (char === "R") ip.d = (ip.d + 1) % 4;
        else if (char === "T") ip.d = (ip.d + 2) % 4;
        else if (char === "L") ip.d = (ip.d + 3) % 4;
        else if (char === "U") ip.d = (ip.d + 3) % 4, state = "rotate-l";
        else if (char === "u") ip.d = (ip.d + 1) % 4, state = "rotate-r";
        else if (char === "W") ip.d = (ip.d + 3) % 4, state = "rotate-r";
        else if (char === "w") ip.d = (ip.d + 1) % 4, state = "rotate-l";
        else if (char === "$") state = "skip";
        else if (char === "@") return stop("Program finished.");
        
        else if (char === "?") ip.d = (ip.d + (stack[stack.length-1] < 0 ? 3 : stack[stack.length-1] > 0 ? 1 : 0)) % 4;
        else if (char === "!") { if (stack.length && stack[stack.length-1]) state = "skip"; }
        
        else if (char === "+") stack.push((stack[stack.length-2]||0)+(stack[stack.length-1]||0));
        else if (char === "-") stack.push((stack[stack.length-2]||0)-(stack[stack.length-1]||0));
        else if (char === "*") stack.push((stack[stack.length-2]||0)*(stack[stack.length-1]||0));
        else if (char === ",") stack.push((stack[stack.length-2]||0)/(stack[stack.length-1]||0)|0);
        else if (char === "%") stack.push((stack[stack.length-2]||0)%(stack[stack.length-1]||0));
        else if (char === "a") stack.push((stack[stack.length-2]||0)&(stack[stack.length-1]||0));
        else if (char === "b") stack.push((stack[stack.length-2]||0)|(stack[stack.length-1]||0));
        else if (char === "c") stack.push((stack[stack.length-2]||0)^(stack[stack.length-1]||0));
        
        else if (char === "(") stack.push((stack.pop()||0)-1);
        else if (char === ")") stack.push((stack.pop()||0)+1);
        else if (char === "n") stack.push(-(stack.pop()||0));
        else if (char === "~") stack.push(~(stack.pop()||0));
        
        
        if (ip.d === 0) {
            ip.x++;
            if (ip.x >= size)
                ip = [
                    {f:3,x:size-ip.y-1,y:0,d:1},
                    {f:2,x:0,y:ip.y,d:0},
                    {f:3,x:0,y:ip.y,d:0},
                    {f:4,x:0,y:ip.y,d:0},
                    {f:1,x:0,y:ip.y,d:0},
                    {f:3,x:ip.y,y:size-1,d:3}
                ][ip.f];
        }
        else if (ip.d === 1) {
            ip.y++;
            if (ip.y >= size) 
                ip = [
                    {f:2,x:ip.x,y:0,d:1},
                    {f:5,x:0,y:size-ip.x-1,d:0},
                    {f:5,x:ip.x,y:0,d:1},
                    {f:5,x:size-1,y:ip.x,d:2},
                    {f:5,x:size-ip.x-1,y:size-1,d:3},
                    {f:4,x:size-ip.x-1,y:size-1,d:3}
                ][ip.f];
        }
        else if (ip.d === 2) {
            ip.x--;
            if (ip.x < 0) 
                ip = [
                    {f:1,x:ip.y,y:0,d:1},
                    {f:4,x:size-1,y:ip.y,d:2},
                    {f:1,x:size-1,y:ip.y,d:2},
                    {f:2,x:size-1,y:ip.y,d:2},
                    {f:3,x:size-1,y:ip.y,d:2},
                    {f:1,x:size-1-ip.y,y:size-1,d:3}
                ][ip.f];
        }
        else if (ip.d === 3) {
            ip.y--;
            if (ip.y < 0) 
                ip = [
                    {f:4,x:size-1-ip.x,y:0,d:1},
                    {f:0,x:0,y:ip.x,d:0},
                    {f:0,x:ip.x,y:size-1,d:3},
                    {f:0,x:size-1,y:size-1-ip.x,d:2},
                    {f:0,x:size-1-ip.x,y:0,d:1},
                    {f:2,x:ip.x,y:size-1,d:3}
                ][ip.f];
        }
    }
    
    $("run").disabled = true;
    $("run").innerHTML = "Running...";
    $("stop").disabled = false;
    $("pause").disabled = false;
    var paused = false;
    
    pause = function pause() {
        if (paused) {
            paused = false;
            $("pause").innerHTML = "Pause";
            console.log("Program resumed.");
            interval = setInterval(update,50);
        } else {
            paused = true;
            console.log("Program paused.");
            $("pause").innerHTML = "Resume";
            clearInterval(interval);
        }
    }
    
    interval = setInterval(update,50);
}

function stop(m) {
    clearInterval(interval);
    console.log(m);
    $("run").disabled = false;
    $("run").innerHTML = "Run";
    $("stop").disabled = true;
    $("pause").disabled = true;
    $("pause").innerHTML = "Pause";
}
