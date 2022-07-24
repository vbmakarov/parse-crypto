import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ParsingService } from "src/parsing/parsing.service";

@WebSocketGateway({
    cors: {
      origin: '*',
      methods: ["GET", "POST"],
      credentials: true,
      transports: ['websocket', 'polling'],
    },
   })
export class SocketIoGateway{

    constructor(private ParsingService: ParsingService){}

    @WebSocketServer()
    server

    interval: ReturnType<typeof setInterval>

    @SubscribeMessage("parsing")
    handleMessage(@MessageBody() data:string){
        this.interval = setInterval(()=>{
            //const dataForClient = process.env.ALLOW_PARSE === "true"? await this.ParsingService.lastRecord():[]
            //console.log(dataForClient,"dataForClient")
            new Promise((resolve, reject)=>{
                const dataForClient = process.env.ALLOW_PARSE === "true"? this.ParsingService.lastRecord():[]
                resolve(dataForClient)
            }).then(data=>{
                this.server.emit("parsing", {data})
            })
        },2000)
        
    }

    handleDisconnect(){
        clearInterval(this.interval)
    }

}