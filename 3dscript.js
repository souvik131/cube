
var pressedKeys = {};
window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }




function run(){

  
      new Vue({
          el: '#app',
          data: {
            size:0.25,
            xt:0,
            yt:0,
            zt:0,
            zd:1,
            xd:0,
            yd:0,
            lx:1,
            ly:1,
            lz:0,
            chars:".-*",
            ascii:false,
          },
          methods: {
  
            init: async function () {
                let allCoordinates=this.getCube()
                await this.animate(allCoordinates)
            },
            onKeyPress: function(data){
                console.log(data)
            },
            checkAndRenderActions:function (){
                let pressed=false  
                if(pressedKeys[65]){
                    this.ascii=!this.ascii
                    console.log("ascii",this.ascii)
                } 
                if(pressedKeys[38]){
                    this.yd+=0.01
                    pressed=true
                }
                if(pressedKeys[40]){
                    this.yd-=0.01
                    pressed=true
                }
                if(pressedKeys[39]){
                    this.xd+=0.01
                    pressed=true
                }
                if(pressedKeys[37]){
                    this.xd-=0.01
                    pressed=true
                }
                if(pressedKeys[83]){
                    this.zd+=0.01
                    pressed=true
                }
                if(pressedKeys[87]){
                    this.zd-=0.01
                    pressed=true
                }
                if(pressedKeys[49]){
                    this.xt+=0.01
                    pressed=true
                }
                if(pressedKeys[50]){
                    this.xt-=0.01
                    pressed=true
                }
                if(pressedKeys[51]){
                    this.yt+=0.01
                    pressed=true
                }
                if(pressedKeys[52]){
                    this.yt-=0.01
                    pressed=true
                }
                if(pressedKeys[53]){
                    this.zt+=0.01
                    pressed=true
                }
                if(pressedKeys[54]){
                    this.zt-=0.01
                    pressed=true
                }
            
            
                if(pressedKeys[90]){
                    if(this.lx==-1){
                        this.lx=0
                    }
                    else if(this.lx==0){
                        this.lx=1
                    }
                    else if(this.lx==1){
                        this.lx=-1
                    }
                }
            
                if(pressedKeys[88]){
                    if(this.ly==-1){
                        this.ly=0
                    }
                    else if(this.ly==0){
                        this.ly=1
                    }
                    else if(this.ly==1){
                        this.ly=-1
                    }
                }
            
                if(pressedKeys[67]){
                    if(this.lz==-1){
                        this.lz=0
                    }
                    else if(this.lz==0){
                        this.lz=1
                    }
                    else if(this.lz==1){
                        this.lz=-1
                    }
                }
            
                if(!pressed){
                    this.xt+=0.01
                    this.yt+=0.01
                    this.zt+=0.01
                }
            },
            
            animate:async function (coordinates){
               
                while(true){
                    this.context.clearRect(0,0,this.width,this.height)
                    for (const coordinate of coordinates){
                        let [x,y,z]=coordinate
            
                        let sx = Math.sin(this.xt)
                        let cx = Math.cos(this.xt)
                        let sy = Math.sin(this.yt)
                        let cy = Math.cos(this.yt)
                        let sz = Math.sin(this.zt)
                        let cz = Math.cos(this.zt)
            
                      //  |1  0  0||c  0  s||c -s  0|| x |
                      //  |0  c -s||0  1  0||s  c  0|| y |
                      //  |0  s  c||-s 0  c||0  0  1|| z |
            
                        let x1=cz*x-sz*y
                        let y1=sz*x+cz*y
                        let z1=z
            
                        let x2=cy*x1+sy*z1
                        let y2=y1
                        let z2=-sy*x1+cy*z1
            
                        let x3 = x2+this.xd
                        let y3 = cx*y2-sx*z2+this.yd
                        let z3 = sx*y2+cx*z2+this.zd
                        
                        // let lz=0
                        // if(this.lz==0){
                        //     lz=1
                        // }

                        // if(this.lz==1){
                        //     lz=0
                        // }
            
                        let brightness=(x3*this.lx+y3*this.ly+z3*this.lz)
            
                        xp = ( 1/z3 * x3);
                        yp = ( 1/z3 * y3);
                        // console.log(brightness)
                        if (brightness<0){
                            brightness=0
                        }
                        if (this.ascii){
                            let textValue=this.chars[parseInt(brightness,10)]
                            this.drawPointAscii([xp,yp],textValue)

                        }
                        else{
                            this.drawPoint([xp,yp],brightness)
                        }
                    }
            
                    this.checkAndRenderActions()
            
                    // console.log([lx,ly,lz])
            
            
                    await this.wait(0)
                }
            },
            
            drawPointAscii:function (coordinate,text="."){
                let context=this.context
                let [x,y]=coordinate
                x=x*0.5+0.5
                y=y*0.5+0.5
                context.beginPath();
                context.fillStyle = '#ffffff';
                context.fillText(text,x*this.width*0.97, (1-y)*this.height*0.97);
                context.fill();
                return [x,y]
            },
            
            drawPoint:function(coordinate,opacity=1){
                let context=this.context
                let [x,y]=coordinate
                x=x*0.5+0.5
                y=y*0.5+0.5
                context.beginPath();
                context.fillStyle = `rgba(225,225,225,${opacity})`;
                context.rect(x*this.width*0.97, (1-y)*this.height*0.97,1, 1);
                context.fill();
                // ctx.globalAlpha = 1.0;
                return [x,y]
            },
            
            getLine:function(coordinates){
                
                let [x0,y0,z0]=coordinates[0]
                let [x1,y1,z1]=coordinates[1]
                let xd=x1-x0
                let yd=y1-y0
                let zd=z1-z0
                let t=0
                let out=[]
                while(t<=1){
                    out.push([x0+xd*t,y0+yd*t,z0+zd*t])
                    t+=0.01
                }
            
                return out
            },
            
            getCube:function(){
                // return [[size,size,size],
                //         [-size,size,size],
                //         [size,-size,size],
                //         [-size,-size,size],
                //         [size,size,-size],
                //         [-size,size,-size],
                //         [size,-size,-size],
                //         [-size,-size,-size]]
            
                // return getLine([[-size,size,size],[size,size,size]])
                // .concat(getLine([[size,size,size],[size,-size,size]]))
                // .concat(getLine([[size,-size,size],[-size,-size,size]]))
                // .concat(getLine([[-size,-size,size],[-size,size,size]]))
                // .concat(getLine([[-size,size,-size],[size,size,-size]]))
                // .concat(getLine([[size,size,-size],[size,-size,-size]]))
                // .concat(getLine([[size,-size,-size],[-size,-size,-size]]))
                // .concat(getLine([[-size,-size,-size],[-size,size,-size]]))
                // .concat(getLine([[-size,size,-size],[-size,size,size]]))
                // .concat(getLine([[size,size,-size],[size,size,size]]))
                // .concat(getLine([[size,-size,-size],[size,-size,size]]))
                // .concat(getLine([[-size,-size,-size],[-size,-size,size]]))
            
                let size=this.size
                let i=-size
                let lines=[]
                while(i<size){
                    lines=lines.concat(this.getLine([[i,-size,size],[i,size,size]]))
                    lines=lines.concat(this.getLine([[i,-size,-size],[i,size,-size]]))
                    lines=lines.concat(this.getLine([[size,i,size],[size,i,-size]]))
                    lines=lines.concat(this.getLine([[-size,i,size],[-size,i,-size]]))
                    lines=lines.concat(this.getLine([[i,size,-size],[i,size,size]]))
                    lines=lines.concat(this.getLine([[i,-size,-size],[i,-size,size]]))
            
                    i+=0.01
                }
                return lines
            },
            
        
            wait: time => new Promise(_ => setTimeout(_, time)),
          },
          watch: {
          },
          mounted() {
            var canvas= document.querySelector("canvas");
            canvas.height=window.innerHeight
            canvas.width=window.innerWidth
            this.height=canvas.height
            this.width=canvas.width
            this.context = canvas.getContext('2d');
            this.init()
          }
      })
  }


;(async()=>{
    run()
})()








