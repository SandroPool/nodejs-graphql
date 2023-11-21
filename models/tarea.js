const { Schema, model } = require('mongoose');

const TareaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    creador: {
        type: Schema.Types.ObjectId,
        ref: 'usuario'
    },
    creado: {
        type: Date,
        default: Date.now()
    },
    proyecto: {
        type: Schema.Types.ObjectId,
        ref: 'proyecto'
    },
    estado: {
        type: Boolean,
        default: false
    }
})


module.exports = model('tarea', TareaSchema);

