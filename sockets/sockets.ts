import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuario-lista';
import { Usuario } from '../classes/usuario';

export const usuarioConectados = new UsuariosLista();


export const conectarCliente= (cliente: Socket) => {
    const usuario= new Usuario(cliente.id);
    usuarioConectados.agregar(usuario);
}


export const desconnectar = (cliente: Socket) => {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioConectados.borrarUsuario(cliente.id);
    });
}

// Escuchar mensajes
//socketIO para emitir mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    
    cliente.on('mensaje', (payload: {de: string,cuerpo: string}) => {
        console.log("Mensaje recibido", payload);

        io.emit('mensaje-nuevo',payload);

    });
}


// Configurar usuario
export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {
    
    cliente.on('configurar-usuario', (payload: {nombre:string}, callback: Function) => {
       usuarioConectados.actualizarNombre(cliente.id, payload.nombre);
        
        callback({
            ok:true,
            mensaje: `Usuario ${payload.nombre}, configurado`
        });
    });
}