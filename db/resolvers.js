const Usuario = require('../models/usuario');
const { genSalt, hash, compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const Proyecto = require('../models/proyecto');
const Tarea = require('../models/tarea');
require('dotenv').config({ path: '../.env' });



const crearToken = (usuario, secreta, expiresIn) => {
    const { id, email } = usuario;

    return sign({ id, email }, secreta, { expiresIn });
}

const resolvers = {
    Query: {
        obtenerProyectos: async (_, { }, ctx) => {
            try {
                const proyectos = await Proyecto.find({ creador: ctx.id });

                return proyectos
            } catch (error) {
                console.log(error);
            }
        },

        obtenerTareas: async (_, { input }, ctx) => {
            const tareas = await Tarea.find({creador: ctx.id}).where('proyecto').equals(input.proyecto);

            return tareas;
        }
    },
    Mutation: {
        crearUsuario: async (_, { input }) => {
            const { email, password } = input;
            const existeUsuario = await Usuario.findOne({ email });
            if (existeUsuario) {
                throw new Error('Usuario Registrado intenta con otro.');
            }


            try {
                // hash password
                const salt = await genSalt(10);
                input.password = await hash(password, salt);

                const nuevoUsuario = new Usuario(input);
                nuevoUsuario.save();

                console.log(nuevoUsuario);

                return 'Usuario Creado Correactamente.'
            } catch (error) {
                console.log(error);
            }

        },
        authenticarUsuario: async (_, { input }) => {
            const { email, password } = input;

            const existeUsuario = await Usuario.findOne({ email });

            if (!existeUsuario) {
                throw new Error('El usuario no existe.');
            }

            //si el passwor es correcto
            const passwordCorrecto = await compare(password, existeUsuario.password);

            if (!passwordCorrecto) {
                throw new Error('Password Incorrecto');
            }

            //Permite acceso
            return {
                token: crearToken(existeUsuario, process.env.SECRET, '1d')
            };
        },

        nuevoProyecto: async (_, { input }, ctx) => {
            try {
                const proyecto = new Proyecto(input);

                //Asociar el creador
                proyecto.creador = ctx.id;

                //Almacenarlo
                const resultado = await proyecto.save();

                return resultado;
            } catch (error) {
                console.log(error);
            }
        },
        actualizarProyecto: async (_, { id, input }, ctx) => {
            //validar si existe el proyecto
            let proyecto = await Proyecto.findById(id);

            if (!proyecto) {
                throw new Error('Proyecto no encontrador');
            }

            if (proyecto.creador.toString() !== ctx.id) {
                throw new Error('No tienes las credencias para editar');
            }

            //guardar el proyecto
            proyecto = await Proyecto.findOneAndUpdate({ _id: id }, input, { new: true });
            return proyecto;
        },
        eliminarProyecto: async (_, { id }) => {
            //validar si existe el proyecto
            let proyecto = await Proyecto.findById(id);

            if (!proyecto) {
                throw new Error('Proyecto no encontrado');
            }

            await Proyecto.findOneAndDelete({_id: id});

            return 'Proyecto eliminado';
        },
        nuevaTarea: async(_, {input}, ctx) => {
            try {
                const tarea = new Tarea(input);
                tarea.creador = ctx.id;
                const resultado = await tarea.save();
                return resultado;
            } catch (error) {
                
            }
        },
        actualizarTarea: async (_, { id, input, estado }, ctx) => {
            //existe la tarea
            let tarea = await Tarea.findById(id);

            if (!tarea) {
                throw new Error('Tarea no encontrada...');
            }


            if (tarea.creador.toString() !== ctx.id) {
                throw new Error('No tienes las credencias para editar');
            }

            input.estado = estado;
            
            tarea = await Tarea.findOneAndUpdate({ _id: id }, input, { new: true });
            return tarea;
        },

        eliminarTarea: async (_, { id }, ctx) => {
                   //existe la tarea
            let tarea = await Tarea.findById(id);

            if (!tarea) {
                throw new Error('Tarea no encontrada...');
            }


            if (tarea.creador.toString() !== ctx.id) {
                throw new Error('No tienes las credencias para editar');
            }

            //eliminar
            await Tarea.findOneAndDelete({_id: id});

            return 'Task Deleted';
        }
    }
}

module.exports = resolvers;

