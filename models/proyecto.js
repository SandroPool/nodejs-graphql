const { Schema, model } = require('mongoose');
const ProyectoSchema = new Schema({
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
    }
})


module.exports = model('proyecto', ProyectoSchema);


