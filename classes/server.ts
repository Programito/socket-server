import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/sockets';

export default class Server{
    
    //Singleton server
    private static _instance:Server;


    public app: express.Application;
    public port:number;

    public io:socketIO.Server;

    private httpServer:http.Server;


    private constructor() {

        this.app = express();
        this.port= SERVER_PORT;

        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);

        this.escucharSockets();
    }

    public static get instance(){
        return this._instance || (this._instance = new this());
    }

    private escucharSockets(){
        console.log('Escuchando conexiones - sockets');

        this.io.on('connect', cliente => {

            //console.log("Cliente conectado");

            // Conectar cliente
            socket.conectarCliente(cliente);

            // Configurar Usuario
            socket.configurarUsuario(cliente, this.io);

            // Mensajes
            socket.mensaje(cliente, this.io);
        
            //cliente.on('disconnect', () => {
                //console.log('Cliente Desconectado');
            //});
            // Desconectar
            socket.desconnectar(cliente);


        });
    }

    start( callback: Function ) {

        //this.app.listen( this.port, callback );
        this.httpServer.listen( this.port, callback );

    }

}